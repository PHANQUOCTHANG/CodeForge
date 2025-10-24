import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import { authCheckFinished, login } from "../slices/authSlice";
import authApi from "@/features/auth/services/authApi";
import { setGlobalAccessToken, setGlobalDispatch } from "@/api/axios";

export const useInitAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const initRef = useRef(false);
  const { isAuthChecking, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    // ✅ Setup dispatch cho Axios interceptors
    setGlobalDispatch(dispatch);

    const initAuth = async () => {
      try {
        if (token) {
          setGlobalAccessToken(token);
          dispatch(authCheckFinished());
          return;
        }

        const res = await authApi.refreshAuth();
        const { accessToken, userInfo } = res.data;

        setGlobalAccessToken(accessToken);
        dispatch(login({ accessToken, userInfor: userInfo }));

        console.log("✅ Auto login success:", userInfo);
      } catch (error: any) {
        console.log(error);

        if (error.response) {
          const status = error.response.status;
          if (status === 401 || status === 403) {
            console.warn("🚫 Refresh token hết hạn, logout...");
            setGlobalAccessToken(null);
            navigate("/log-out");
          } else {
            console.warn("⚠️ Server error:", error.response.data?.message);
          }
        } else if (error.request) {
          console.warn("❌ Không thể kết nối tới server:", error.message);
        } else {
          console.warn("❌ Lỗi không xác định:", error.message);
        }
      } finally {
        dispatch(authCheckFinished());
      }
    };

    initAuth();
  }, [dispatch, navigate, token, isAuthChecking]);
};
