import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/app/store/store";
import { openNotification } from "@/common/helper/notification";
import { setGlobalAccessToken } from "@/api";
import authApi from "@/features/auth/services/authApi";
import type { ApiResponse } from "@/common/types";
import type { LoginResponse, RegisterRequest } from "@/features/auth/types";
import { login } from "@/features/auth/slices/authSlice";
import { useQueryClient } from "@tanstack/react-query";
export const useRegister = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),

    onSuccess: (res: ApiResponse<LoginResponse>) => {
      openNotification("success", "Thành công", "Đăng ký thành công!");
      if (res.isSuccess) {
        setTimeout(() => {
          const { accessToken, userInfo } = res.data;

          setGlobalAccessToken(accessToken);
          dispatch(login({ accessToken: accessToken, userInfor: userInfo }));
          openNotification(
            "success",
            "Thành công",
            "Tự động đăng nhập thành công!"
          );
          queryClient.invalidateQueries();
          // ✅ 6. Chuyển hướng đến trang chủ
          navigate("/");
        }, 1200);
      }
      navigate("/");
    },

    onError: (error: any) => {
      openNotification(
        "error",
        "Thất bại",
        error?.response?.data?.message || "Đăng ký thất bại!"
      );
    },
  });
};
