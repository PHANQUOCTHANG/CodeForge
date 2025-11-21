// src/services/authApi.ts

import api from "@/api/axios";
import type { ApiResponse } from "@/common/types";
import type {
  LoginResponse,
  RegisterResponse,
  RefreshResponse,
  LoginRequest,
  RegisterRequest,
} from "@/features/auth/types";

//auth service
const authApi = {
  // 🟢 Đăng nhập
  // ✅ Trả về AuthDto: Đây là phần dữ liệu thuần túy được Redux lưu trữ
  login: async (payload: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    // Axios được định kiểu sẽ trả về AuthResponse trong res.data
    const res = await api.post<ApiResponse<LoginResponse>>(
      "api/Auth/login",
      payload
    );
    // Kiểm tra lỗi (thường là lỗi logic 400/409/500 đã được Global Handler bắt,
    // nhưng nên phòng hờ nếu API trả 200/201 nhưng có lỗi logic)
    return res.data;
  },

  // 🟣 Đăng ký
  register: async (
    payload: RegisterRequest
  ): Promise<ApiResponse<RegisterResponse>> => {
    const res = await api.post<ApiResponse<RegisterResponse>>(
      "api/Auth/register",
      payload
    );

    return res.data;
  }, // Endpoint này sử dụng Refresh Token trong Cookie để lấy Access Token mới
  // 🔄 TÁI KHỞI TẠO PHIÊN (Refresh Token)
  refreshAuth: async (): Promise<ApiResponse<RefreshResponse>> => {
    const res = await api.post<ApiResponse<RefreshResponse>>(
      "api/Auth/refresh-token"
    ); // res.data ở đây là đối tượng ApiResponse
    return res.data;
  },
  // 🔴 Đăng xuất (giữ nguyên)
  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/log-out");
    } catch (error: unknown) {
      console.warn(
        "Logout process completed, but server failed to revoke token (already revoked or expired)." +
          error
      );
    }
  },
};

export default authApi;
