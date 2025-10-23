import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import authApi from "@/api/authApi";
import { setGlobalAccessToken } from "@/api/axios";

// ========================
// 1️⃣ Kiểu dữ liệu User
// ========================
export interface UserProfile {
  userId: string;
  username: string;
  email: string;
  role: string;
  joinDate: string;
}

// ========================
// 2️⃣ Kiểu dữ liệu Auth
// ========================
export interface AuthDto {
  accessToken: string;
  refreshToken?: string;
  userInfo: UserProfile;
}

export interface ApiResponse {
  isSuccess: boolean;
  message: string;
  data: AuthDto;
  errors: string[] | null;
}

// ========================
// 3️⃣ Redux State
// ========================
export interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthChecking: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthChecking: true, // 🔥 Cần có khi F5 (App đang kiểm tra refresh token)
};

// ========================
// 4️⃣ Async thunk: refreshToken
// ========================
// Tự động gọi lại khi app F5 (refreshToken cookie còn hợp lệ)
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.refreshAuth(); // Gọi tới /auth/refresh-token
      const { accessToken, userInfo } = response.data;

      // Lưu token vào axios global
      setGlobalAccessToken(accessToken);

      return { accessToken, user: userInfo };
    } catch (error: any) {
      console.error("❌ Refresh token failed:", error);
      return rejectWithValue(error.response?.data || "Refresh failed");
    }
  }
);

// ========================
// 5️⃣ Slice chính
// ========================
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 🟢 Đăng nhập thủ công
    login: (
      state,
      action: PayloadAction<{ accessToken: string; userInfor: UserProfile }>
    ) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.userInfor;
      state.isAuthChecking = false;
    },

    // 🟡 Refresh thành công (được interceptor axios gọi)
    refreshSuccess: (state, action: PayloadAction<{ accessToken: string }>) => {
      state.token = action.payload.accessToken;
    },

    // 🔴 Đăng xuất
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthChecking = false;
    },

    // ⚪ Dùng sau khi check refresh xong (bất kể thành công/thất bại)
    authCheckFinished: (state) => {
      state.isAuthChecking = false;
    },
  },

  // ========================
  // 6️⃣ Xử lý Async (extraReducers)
  // ========================
  extraReducers: (builder) => {
    builder.addCase(refreshToken.pending, (state) => {
      state.isAuthChecking = true;
    });

    builder.addCase(
      refreshToken.fulfilled,
      (
        state,
        action: PayloadAction<{ accessToken: string; user: UserProfile }>
      ) => {
        state.token = action.payload.accessToken;
        state.user = action.payload.user;
        state.isAuthChecking = false;
      }
    );

    builder.addCase(refreshToken.rejected, (state) => {
      state.isAuthChecking = false;
      state.user = null;
      state.token = null;
    });
  },
});

// ========================
// 7️⃣ Export action & reducer
// ========================
export const { login, logout, refreshSuccess, authCheckFinished } =
  authSlice.actions;
export default authSlice.reducer;
