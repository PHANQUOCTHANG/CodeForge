import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/app/store/store";
import { login } from "../slices/authSlice";
import { openNotification } from "@/common/helper/notification";
import { setGlobalAccessToken } from "@/api";
import authApi from "@/features/auth/services/authApi";
import type { LoginResponse } from "@/features/auth/types";
import type { ApiResponse } from "@/common/types";

export const useLogin = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (res: ApiResponse<LoginResponse>) => {
      const { accessToken, userInfo } = res.data;
      setGlobalAccessToken(accessToken);
      dispatch(login({ accessToken: accessToken, userInfor: userInfo }));
      openNotification("success", "Thành công", "Đăng nhập thành công!");
      navigate("/");
    },
    onError: () => {
      openNotification("error", "Thất bại", "Đăng nhập thất bại!");
    },
  });
};
