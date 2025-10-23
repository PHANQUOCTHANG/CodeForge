// src/services/authApi.ts

import api from "./axios";

// ===================================
// TYPE DEFINITIONS (Định nghĩa kiểu dữ liệu cho Backend Response)
// ===================================

interface UserProfile {
  // Chuyển sang string vì JSON không thể truyền trực tiếp Guid/Date Object
  userId: string;
  username: string;
  email: string;
  role: string;
  joinDate: string; // Định dạng ISO 8601 string
}

interface AuthDto {
  accessToken: string;
  refreshToken: string;
  userInfo: UserProfile;
}

// Định nghĩa kiểu ApiResponse chính xác từ cấu trúc JSON bạn gửi
interface ApiResponse {
  isSuccess: boolean;
  message: string;
  data: AuthDto; // T ở đây sẽ là AuthDto
  errors: string[] | null;
}

// Kiểu phản hồi đầy đủ từ Axios

// ===================================
// API SERVICE LOGIC
// ===================================

const authApi = {
  // 🟢 Đăng nhập
  // ✅ Trả về AuthDto: Đây là phần dữ liệu thuần túy được Redux lưu trữ
  login: async (email: string, password: string): Promise<ApiResponse> => {
    // Axios được định kiểu sẽ trả về AuthResponse trong res.data
    const res = await api.post<ApiResponse>("/auth/login", {
      email,
      password,
    });
    // Lấy đối tượng ApiResponse<AuthDto>
    console.log(res);
    // Kiểm tra lỗi (thường là lỗi logic 400/409/500 đã được Global Handler bắt,
    // nhưng nên phòng hờ nếu API trả 200/201 nhưng có lỗi logic)
    // Trả về đối tượng AuthDto
    return res.data;
  },

  // 🟣 Đăng ký
  register: async (
    username: string,
    email: string,
    password: string
  ): Promise<ApiResponse> => {
    const res = await api.post<ApiResponse>("/auth/register", {
      username,
      email,
      password,
    });

    return res.data;
  }, // Endpoint này sử dụng Refresh Token trong Cookie để lấy Access Token mới
  // 🔄 TÁI KHỞI TẠO PHIÊN (Refresh Token)
  refreshAuth: async (): Promise<ApiResponse> => {
    const res = await api.post<ApiResponse>("/auth/refresh-token"); // res.data ở đây là đối tượng ApiResponse
    console.log(res);
    return res.data;
  },
  // 🔴 Đăng xuất (giữ nguyên)
  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/log-out");
    } catch (error: any) {
      console.warn(
        "Logout process completed, but server failed to revoke token (already revoked or expired)."
      );
    }
  },
};

export default authApi;
