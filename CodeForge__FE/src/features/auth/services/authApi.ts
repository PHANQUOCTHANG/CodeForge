import api from "@/api/axios";
import type { ApiResponse } from "@/common/types";
import type {
  LoginResponse,
  RegisterResponse,
  RefreshResponse,
  LoginRequest,
  RegisterRequest,
} from "@/features/auth/types";

const authApi = {
  // 🟢 Đăng nhập
  login: async (payload: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const res = await api.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      payload
    );
    return res.data;
  },

  // 🟣 Đăng ký
  register: async (
    payload: RegisterRequest,
    secret?: string
  ): Promise<ApiResponse<RegisterResponse>> => {
    const res = await api.post<ApiResponse<RegisterResponse>>(
      `/auth/register${secret ? `/admin/${secret}` : ""}`,
      payload
    );
    return res.data;
  },

  // 🔄 Làm mới Access Token (từ Refresh Token trong cookie)
  refreshAuth: async (): Promise<ApiResponse<RefreshResponse>> => {
    const res = await api.post<ApiResponse<RefreshResponse>>(
      "/auth/refresh-token"
    );
    return res.data;
  },

  // 🔴 Đăng xuất
  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/log-out");
    } catch (error) {
      console.warn("Server có thể đã thu hồi token rồi:", error);
    }
  },
};

export default authApi;
