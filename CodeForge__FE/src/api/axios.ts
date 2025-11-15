import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import API_URL from "./config";
import { logout, refreshSuccess } from "@/features/auth/slices/authSlice";
import { openNotification } from "@/common/helper/notification";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface RetryQueueItem {
  resolve: (value: string | PromiseLike<string>) => void;
  reject: (reason?: any) => void;
}

interface ErrorResponseData {
  message?: string;
  errorCode?: string;
  [key: string]: any;
}

// Extend AxiosRequestConfig để thêm custom properties
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _skipAuthRefresh?: boolean;
}

// ============================================================================
// GLOBAL STATE MANAGEMENT
// ============================================================================

let currentAccessToken: string | null = null;
let dispatchFunction: Dispatch<AnyAction> = () => {
  console.error("⚠️ Dispatch function chưa được khởi tạo!");
};

// Quản lý trạng thái refresh token
let isRefreshing: boolean = false;
let failedQueue: RetryQueueItem[] = [];

// Danh sách URL không cần xử lý authentication
const EXCLUDED_URLS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh-token",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
];

// ============================================================================
// PUBLIC API - Khởi tạo từ App
// ============================================================================

export const setGlobalAccessToken = (token: string | null) => {
  currentAccessToken = token;
  console.log("🔑 Access token đã được cập nhật");
};

export const setGlobalDispatch = (dispatch: Dispatch<AnyAction>) => {
  dispatchFunction = dispatch;
  console.log("✅ Dispatch function đã được khởi tạo");
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const isExcludedUrl = (url?: string): boolean => {
  if (!url) return false;
  return EXCLUDED_URLS.some((excluded) => url.includes(excluded));
};

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

const handleLogout = (reason: string): void => {
  // Chỉ logout nếu chưa ở trang login
  if (window.location.pathname.includes("/login")) {
    return;
  }

  console.error(`🚪 Đăng xuất: ${reason}`);

  // Clear state
  dispatchFunction(logout());
  setGlobalAccessToken(null);

  // Hiển thị thông báo
  openNotification(
    "warning",
    "Phiên đăng nhập hết hạn",
    "Vui lòng đăng nhập lại để tiếp tục."
  );

  // Redirect sau một khoảng delay nhỏ để đảm bảo notification hiển thị
  setTimeout(() => {
    window.location.href = "/login";
  }, 500);
};

// ============================================================================
// AXIOS INSTANCE CONFIGURATION
// ============================================================================

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // Tăng timeout lên 30s để xử lý các request lớn
  withCredentials: true, // Quan trọng: Cho phép gửi httpOnly cookie
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================================
// REQUEST INTERCEPTOR - Gắn Access Token
// ============================================================================

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Chỉ gắn token cho các endpoint cần authentication
    if (currentAccessToken && !isExcludedUrl(config.url)) {
      config.headers.Authorization = `Bearer ${currentAccessToken}`;
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// ============================================================================
// RESPONSE INTERCEPTOR - Xử lý lỗi và refresh token
// ============================================================================

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorResponseData>) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // Kiểm tra nếu không có config hoặc response
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // ========================================================================
    // XỬ LÝ LỖI 401 - UNAUTHORIZED
    // ========================================================================
    if (error.response?.status === 401) {
      // 1. Bỏ qua các URL được loại trừ
      if (isExcludedUrl(originalRequest.url)) {
        return Promise.reject(error);
      }

      // 2. Nếu request này đã được retry hoặc có flag skip
      if (originalRequest._retry || originalRequest._skipAuthRefresh) {
        return Promise.reject(error);
      }

      // 3. Nếu đang có process refresh khác đang chạy
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // 4. Bắt đầu process refresh token
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("🔄 Đang refresh access token...");

        // Gọi API refresh - refreshToken tự động gửi qua httpOnly cookie
        const response = await api.post<{ accessToken: string }>(
          "/auth/refresh-token",
          {},
          {
            _skipAuthRefresh: true, // Đánh dấu để không retry nếu fail
          } as any
        );

        const newAccessToken = response.data.accessToken;

        // Cập nhật token mới
        setGlobalAccessToken(newAccessToken);
        dispatchFunction(refreshSuccess({ accessToken: newAccessToken }));

        // Cập nhật header cho request gốc
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        // Xử lý queue
        processQueue(null, newAccessToken);

        console.log("✅ Refresh token thành công!");

        // Retry request gốc
        return api(originalRequest);
      } catch (refreshError) {
        console.error("❌ Refresh token thất bại:", refreshError);

        // Xử lý queue failed
        processQueue(refreshError as AxiosError, null);

        // Logout user
        handleLogout("Refresh token hết hạn");

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // ========================================================================
    // XỬ LÝ LỖI 403 - FORBIDDEN
    // ========================================================================
    if (error.response?.status === 403) {
      const responseData = error.response.data;

      console.warn("⚠️ Lỗi 403: Forbidden");

      // Trường hợp đặc biệt: Chưa đăng ký khóa học
      if (
        responseData?.errorCode === "NOT_ENROLLED" ||
        responseData?.message?.toLowerCase().includes("not enrolled")
      ) {
        openNotification(
          "warning",
          "Yêu cầu đăng ký",
          responseData?.message ||
            "Bạn cần đăng ký khóa học để truy cập nội dung này."
        );
      } else {
        openNotification(
          "error",
          "Truy cập bị từ chối",
          responseData?.message || "Bạn không có quyền thực hiện hành động này."
        );
      }

      return Promise.reject(error);
    }

    // ========================================================================
    // XỬ LÝ LỖI 404 - NOT FOUND
    // ========================================================================
    if (error.response?.status === 404) {
      const responseData = error.response.data;

      console.warn("⚠️ Lỗi 404: Not Found");

      openNotification(
        "info",
        "Không tìm thấy",
        responseData?.message || "Nội dung bạn tìm kiếm không tồn tại."
      );

      return Promise.reject(error);
    }

    // ========================================================================
    // XỬ LÝ CÁC LỖI SERVER KHÁC (400, 500, ...)
    // ========================================================================
    if (error.response) {
      const statusCode = error.response.status;
      const responseData = error.response.data;

      console.error(
        `❌ Lỗi HTTP ${statusCode}:`,
        responseData || error.message
      );

      // Không hiển thị notification cho lỗi validation (400)
      if (statusCode !== 400) {
        openNotification(
          "error",
          `Lỗi ${statusCode}`,
          responseData?.message || "Đã có lỗi xảy ra. Vui lòng thử lại."
        );
      }

      return Promise.reject(error);
    }

    // ========================================================================
    // XỬ LÝ LỖI MẠNG (Không có response)
    // ========================================================================
    if (error.request) {
      console.error("❌ Lỗi mạng:", error.message);

      openNotification(
        "error",
        "Lỗi kết nối",
        "Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng và thử lại."
      );

      return Promise.reject(error);
    }

    // ========================================================================
    // LỖI KHÔNG XÁC ĐỊNH
    // ========================================================================
    console.error("❌ Lỗi không xác định:", error.message);

    openNotification(
      "error",
      "Lỗi không xác định",
      error.message || "Đã có lỗi xảy ra."
    );

    return Promise.reject(error);
  }
);

// ============================================================================
// EXPORT
// ============================================================================

export default api;
