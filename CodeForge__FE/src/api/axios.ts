import axios from "axios";
// import { store } from '../app/store'; // Tuyệt đối KHÔNG import store ở đây
import API_URL from "./config";
import {
  logout,
  refreshSuccess,
} from "@/features/auth/slices/authSlice";
import { openNotification } from "@/common/helper/notification";
// --- START: TypeScript Definitions and Helpers ---
interface RetryQueueItem {
  resolve: (value: string | PromiseLike<string>) => void;
  reject: (reason?: any) => void;
}

// 1. Biến toàn cục và Setter cho Access Token
let currentAccessToken: string | null = null;
export const setGlobalAccessToken = (token: string | null) => {
  currentAccessToken = token;
};

// 2. State và Setter cho Redux Dispatch
let dispatchFunction: any = () => {};
export const setGlobalDispatch = (dispatch: any) => {
  dispatchFunction = dispatch;
};

// 3. Logic Retry Queue
let isRefreshing: boolean = false;
let failedQueue: RetryQueueItem[] = [];
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

// Các URL công khai mà lỗi 401 không được kích hoạt refresh token
const EXCLUDED_URLS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh-token",
  "/auth/log-out",
];
const isExcludedUrl = (url: string) =>
  EXCLUDED_URLS.some((excluded) => url.includes(excluded));
// --- END: TypeScript Definitions and Helpers ---

const api = axios.create({
  baseURL: API_URL, // Thay thế bằng API_URL thực tế
  timeout: 10000000,
  withCredentials: true, // Gửi cookie Refresh Token
  headers: { "Content-Type": "application/json" },
});

// GẮN ACCESS TOKEN
api.interceptors.request.use(
  (config) => {
    const token = currentAccessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// // INTERCEPTOR PHẢN HỒI (Xử lý 401)
api.interceptors.response.use(
  (response) => response,
  async (error: any) => {
    const originalRequest = error.config;

    // Chỉ xử lý lỗi 401 và chưa thử lại
    if (error.response?.status === 401 && !originalRequest._retry) {
      // ✅ FIX: LOẠI TRỪ LOGIN/REGISTER
      if (isExcludedUrl(originalRequest.url as string)) {
        return Promise.reject(error.response?.data || error);
      }

      originalRequest._retry = true;

      // 2. Chặn các request khác trong khi đang refresh
      if (isRefreshing) {
        return new Promise<string>(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        // 3. GỌI API REFRESH
        const res = await api.post("/auth/refresh-token");
        const newAccessToken = res.data.accessToken;
        // 4. ✅ FIX: CẬP NHẬT TRẠNG THÁI REDUX (chỉ cập nhật token)
        dispatchFunction(refreshSuccess({ accessToken: newAccessToken }));
        setGlobalAccessToken(newAccessToken);
        // 5. Thử lại request gốc và xử lý hàng đợi
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        return api(originalRequest);
      } catch (err) {
        // 6. Refresh token thất bại -> Bắt buộc Logout
        processQueue(err, null);

        dispatchFunction(logout()); // Xóa token khỏi Redux
        openNotification(
          "error",
          "Thất bại",
          "Refresh token failed, logging out..."
        );
        console.error("Refresh token failed, logging out...", err);
        window.location.href = "/login";

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default api;
