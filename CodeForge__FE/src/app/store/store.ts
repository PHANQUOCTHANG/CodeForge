// store.ts

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/slices/authSlice";
import lessonUpdateReducer from "@/features/progress/slices/lessonUpdateSlice";
import paymentStatusReducer from "@/features/payment/slices/StatusPayment";
import { setGlobalAccessToken } from "@/api/axios";

// 1️⃣, 2️⃣ (Giữ nguyên)
import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux"; // 👈 Thêm import

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lessonUpdate: lessonUpdateReducer,
    paymentStatus: paymentStatusReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 3️⃣ (Giữ nguyên)
let currentToken: string | null = store.getState().auth.token;
store.subscribe(() => {
  const previousToken = currentToken;
  const newToken = store.getState().auth.token;

  if (previousToken !== newToken) {
    currentToken = newToken;
    setGlobalAccessToken(newToken);
  }
});

// ==========================================================
// 4️⃣ SỬA LẠI HOÀN TOÀN MỤC NÀY
// ==========================================================
// Tạo hook với kiểu dữ liệu (types)
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
