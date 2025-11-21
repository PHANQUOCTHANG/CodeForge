import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import API_URL from "./config";
import { logout, refreshSuccess } from "@/features/auth/slices/authSlice";
import { openNotification } from "@/common/helper/notification";
import { AnyAction, type Dispatch } from "@reduxjs/toolkit";

// ============================================================================
// ⚠️ QUẢN LÝ TRẠNG THÁI TOÀN CỤC
// ============================================================================

// Định nghĩa Queue Item để xếp hàng các yêu cầu bị lỗi 401
interface RetryQueueItem {
  resolve: (value: string | PromiseLike<string>) => void;
  reject: (reason?: any) => void;
}

interface ErrorResponseData {
  message?: string;
  errorCode?: string;
  [key: string]: any;
}

// Custom Config để đánh dấu yêu cầu đã retry
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let currentAccessToken: string | null = null;
let dispatchFunction: Dispatch<AnyAction> = <T extends AnyAction>(
  action: T
) => {
  console.error("⚠️ Dispatch chưa được khởi tạo");
  return action;
};

let isRefreshing = false; // Cờ báo hiệu đang trong quá trình refresh
let failedQueue: RetryQueueItem[] = []; // Hàng đợi các yêu cầu lỗi

// Danh sách URL được miễn trừ không cần Access Token
const EXCLUDED_URLS = ["/auth/login", "/auth/register", "/auth/refresh-token"];

// ============================================================================
// Helpers
// ============================================================================
export const setGlobalAccessToken = (token: string | null) => {
  currentAccessToken = token;
};

export const setGlobalDispatch = (dispatch: Dispatch<AnyAction>) => {
  dispatchFunction = dispatch;
};

const isExcludedUrl = (url?: string): boolean =>
  !!url && EXCLUDED_URLS.some((e) => url.includes(e));

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((p) =>
    error ? p.reject(error) : p.resolve(token as string)
  );
  failedQueue = [];
};

const handleLogout = () => {
  dispatchFunction(logout());
  setGlobalAccessToken(null);
  openNotification(
    "warning",
    "Phiên đăng nhập hết hạn",
    "Vui lòng đăng nhập lại."
  );
  // Có thể thêm logic chuyển hướng (navigate) ở đây
};

// ============================================================================
// AXIOS INSTANCE
// ============================================================================
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Instance riêng cho refresh token (Không cần interceptor)
const refreshInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ============================================================================
// REQUEST INTERCEPTOR (Thêm Access Token vào Header)
// ============================================================================
api.interceptors.request.use(
  (config) => {
    const customConfig = config as CustomAxiosRequestConfig;

    // Chỉ thêm Access Token nếu:
    // 1. Token tồn tại
    // 2. Không nằm trong danh sách miễn trừ
    // 3. Không phải là yêu cầu đã được đánh dấu _retry (để tránh xung đột)
    if (
      currentAccessToken &&
      !isExcludedUrl(config.url) &&
      !customConfig._retry
    ) {
      config.headers.Authorization = `Bearer ${currentAccessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================================
// RESPONSE INTERCEPTOR (Xử lý 401 và Refresh Token)
// ============================================================================
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorResponseData>) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!originalRequest || !error.response) return Promise.reject(error);

    const status = error.response.status;

    // ---- 401 Unauthorized (Refresh Token Logic) ----
    if (status === 401) {
      // Nếu URL bị lỗi là URL miễn trừ (ví dụ: /auth/login trả 401 do sai pass),
      // HOẶC nếu yêu cầu đã được retry, HOẶC đã được xử lý xong trong hàng đợi (nếu có _retry=true),
      // THÌ KHÔNG refresh, mà trả về lỗi ngay lập tức.
      if (isExcludedUrl(originalRequest.url) || originalRequest._retry) {
        // Nếu là lỗi 401 sau khi đã refresh (lỗi cuối cùng), thì đăng xuất
        if (originalRequest._retry) handleLogout();
        return Promise.reject(error);
      }

      // 1. Nếu đang có một tiến trình refresh khác đang chạy:
      if (isRefreshing) {
        // Xếp yêu cầu hiện tại vào hàng đợi, đợi token mới
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            // Khi có token mới, thiết lập header và gọi lại yêu cầu gốc
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            // Nếu quá trình refresh lỗi, từ chối promise
            return Promise.reject(err);
          });
      }

      // 2. Bắt đầu tiến trình Refresh Token
      originalRequest._retry = true; // Đánh dấu yêu cầu gốc này là đã retry
      isRefreshing = true;

      try {
        // Lấy Refresh Token từ Redux hoặc LocalStorage

        // GỌI API REFRESH
        const res = await refreshInstance.post<{ accessToken: string }>(
          "/auth/refresh-token"
        );
        const newAccessToken = res.data.accessToken;

        // CẬP NHẬT Token toàn cục và Redux
        setGlobalAccessToken(newAccessToken);
        dispatchFunction(refreshSuccess({ accessToken: newAccessToken }));

        // XỬ LÝ HÀNG ĐỢI: Cung cấp token mới cho tất cả yêu cầu đang chờ
        processQueue(null, newAccessToken);

        // LẶP LẠI yêu cầu gốc
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Nếu refresh token thất bại
        processQueue(refreshError as AxiosError, null);
        handleLogout(); // Đăng xuất người dùng
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // ---- Các lỗi khác (403, 404, 5xx) ----
    // (Giữ nguyên logic thông báo và reject)

    if (status === 403) {
      openNotification(
        "error",
        "Truy cập bị từ chối",
        error.response.data?.message
      );
    } else if (status === 404) {
      openNotification("info", "Không tìm thấy", error.response.data?.message);
    } else if (status >= 500) {
      openNotification("error", "Lỗi server", "Vui lòng thử lại sau.");
    }

    return Promise.reject(error);
  }
);

export default api;
