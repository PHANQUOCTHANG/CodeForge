import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import API_URL from "./config";
import { logout, refreshSuccess } from "@/features/auth/slices/authSlice";
import { openNotification } from "@/common/helper/notification";
import { AnyAction, type Dispatch } from "@reduxjs/toolkit";

interface RetryQueueItem {
  resolve: (value: string | PromiseLike<string>) => void;
  reject: (reason?: any) => void;
}

interface ErrorResponseData {
  message?: string;
  errorCode?: string;
  [key: string]: any;
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _skipAuthRefresh?: boolean;
}

let currentAccessToken: string | null = null;
let dispatchFunction: Dispatch<AnyAction> = <T extends AnyAction>(action: T) => {
  console.error("⚠️ Dispatch chưa được khởi tạo");
  return action;
};

let isRefreshing = false;
let failedQueue: RetryQueueItem[] = [];

const EXCLUDED_URLS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh-token",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
];

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

// Instance riêng cho refresh token
const refreshInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ============================================================================
// REQUEST
// ============================================================================
api.interceptors.request.use(
  (config) => {
    if (currentAccessToken && !isExcludedUrl(config.url)) {
      config.headers.Authorization = `Bearer ${currentAccessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================================
// RESPONSE
// ============================================================================
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorResponseData>) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!originalRequest || !error.response) return Promise.reject(error);

    // ---- 401 Unauthorized ----
    if (error.response.status === 401) {
      if (isExcludedUrl(originalRequest.url)) return Promise.reject(error);

      if (originalRequest._retry || originalRequest._skipAuthRefresh) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await refreshInstance.post<{ accessToken: string }>(
          "/auth/refresh-token"
        );
        const newAccessToken = res.data.accessToken;

        setGlobalAccessToken(newAccessToken);
        dispatchFunction(refreshSuccess({ accessToken: newAccessToken }));

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        handleLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // ---- 403 Forbidden ----
    if (error.response.status === 403) {
      openNotification(
        "error",
        "Truy cập bị từ chối",
        error.response.data?.message
      );
      return Promise.reject(error);
    }

    // ---- 404 Not Found ----
    if (error.response.status === 404) {
      openNotification("info", "Không tìm thấy", error.response.data?.message);
      return Promise.reject(error);
    }

    // ---- 5xx Server Error ----
    if (error.response.status >= 500) {
      openNotification("error", "Lỗi server", "Vui lòng thử lại sau.");
    }

    return Promise.reject(error);
  }
);

export default api;
