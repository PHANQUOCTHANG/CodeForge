import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export interface AuthState {
  token: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
}
const initialState: AuthState = {
  token: localStorage.getItem("access_token"),
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ token: string; user: AuthState["user"] }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem("access_token", action.payload.token);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("access_token");
    },
    setUser: (state, action: PayloadAction<AuthState["user"]>) => {
      state.user = action.payload;
    },
  },
});

export const { login, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
