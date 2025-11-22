import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import { setGlobalAccessToken, setGlobalDispatch } from "@/api/axios";
import { openNotification } from "@/common/helper/notification";
import { authCheckFinished, login } from "@/features/auth/slices/authSlice";
import { jwtDecode } from "jwt-decode";
import authApi from "@/features/auth/services/authApi";

const isTokenExpired = (token: string): boolean => {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
};

export const useInitAuth = () => {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);
  const initRef = useRef(false);

  useEffect(() => {
    setGlobalDispatch(dispatch);
  }, [dispatch]);

  useEffect(() => {
    setGlobalAccessToken(token);
  }, [token]);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const initAuth = async () => {
      try {
        if (token && !isTokenExpired(token)) {
          dispatch(authCheckFinished());
          return;
        }

        const res = await authApi.refreshAuth();
        const { accessToken, userInfo } = res.data;

        dispatch(login({ accessToken: accessToken, userInfor: userInfo }));
      } catch (error: any) {
        if (!error?.response) {
          openNotification(
            "warning",
            "Lỗi kết nối",
            "Vui lòng kiểm tra mạng của bạn."
          );
        }
      } finally {
        dispatch(authCheckFinished());
      }
    };

    initAuth();
  }, []);

  return null;
};
