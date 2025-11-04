import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authApi from "@/features/auth/services/authApi";
import { setGlobalAccessToken } from "@/api/axios";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { UserProfile, AuthState } from "@/features/auth/types";

// ========================
// 3️⃣ Redux State
// ========================

//initial starter value
const initialState: AuthState<UserProfile> = {
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
    } catch (error: unknown) {
      console.error("❌ Refresh token failed:", error);
      return rejectWithValue(error || "Refresh failed");
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
