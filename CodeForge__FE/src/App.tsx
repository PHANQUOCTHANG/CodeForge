import React, { useEffect, useRef } from "react";
import ClientRouters from "@/routes/clientRoutes";
import AdminRouters from "@/routes/adminRoutes";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { authCheckFinished, login } from "@/features/auth/authSlice";
import { setGlobalAccessToken, setGlobalDispatch } from "@/api/axios";
import authApi from "@/api/authApi";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const initRef = useRef(false);
  // ✅ Gán dispatch vào Axios interceptor NGAY KHI APP KHỞI TẠO
  setGlobalDispatch(dispatch);
  const { isAuthChecking, token } = useAppSelector((state) => state.auth);
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    const initAuth = async () => {
      try {
        if (token) {
          setGlobalAccessToken(token);
          dispatch(authCheckFinished());
          return;
        }
        const res = await authApi.refreshAuth();
        const { accessToken, userInfo } = res.data;

        // Lưu token vào axios global
        setGlobalAccessToken(accessToken);

        // Cập nhật Redux
        dispatch(login({ accessToken: accessToken, userInfor: userInfo }));

        console.log("✅ Auto login success:", userInfo);
      } catch (error: any) {
        console.log(error);
        // --- PHÂN BIỆT LỖI ---
        if (error.response) {
          // ✅ Lỗi từ server (HTTP status)
          const status = error.response.status;

          if (status === 401 || status === 403) {
            console.warn(
              "🚫 Refresh token hết hạn hoặc không hợp lệ, tiến hành logout"
            );
            setGlobalAccessToken(null);
            navigate("/log-out");
          } else {
            console.warn(
              "⚠️ Server error khi refresh token:",
              error.response.data?.message || error.message
            );
          }
        } else if (error.request) {
          // ✅ Lỗi request (server không phản hồi)
          console.warn("❌ Không thể kết nối tới server:", error.message);
        } else {
          // ✅ Lỗi khác trong quá trình xử lý
          console.warn("❌ Lỗi không xác định khi auto login:", error.message);
        }
      } finally {
        // ✅ Luôn tắt loading (dù thành công hay thất bại)
        dispatch(authCheckFinished());
      }
    };

    initAuth();
  }, [isAuthChecking, dispatch, navigate, token]);
  if (isAuthChecking) {
    <Spin
      spinning={isAuthChecking}
      fullscreen
      tip="Authentication ..." // Added a helpful tip
    />;
  }
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ClientRouters />
        <AdminRouters />
      </ThemeProvider>
    </>
  );
}

export default App;
