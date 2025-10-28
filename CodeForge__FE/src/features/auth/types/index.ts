// ✅ Dữ liệu trả về từ backend
export interface AuthDto<TUser> {
  accessToken: string;
  refreshToken: string;
  userInfo: TUser;
}

// ✅ Mô tả user trong hệ thống
export interface UserProfile {
  userId: string;
  username: string;
  email: string;
  role: string;
  joinDate: string; // ISO string
}

// ✅ Redux slice state
export interface AuthState<TUser = UserProfile> {
  token: string | null;
  user: TUser | null;
  isAuthChecking: boolean;
}

// ✅ Request/Response dạng API
export interface LoginRequest {
  email: string;
  password: string;
}
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export type LoginResponse = AuthDto<UserProfile>;
export type RegisterResponse = AuthDto<UserProfile>;
export type RefreshResponse = AuthDto<UserProfile>;
