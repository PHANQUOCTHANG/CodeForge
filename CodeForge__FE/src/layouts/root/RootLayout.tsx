import { Outlet } from "react-router-dom";
import { useAppSelector } from "@/app/store/store";
import { Spin } from "antd";
import { useInitAuth } from "@/features";

const RootLayout = () => {
  const { isAuthChecking } = useAppSelector((state) => state.auth);
  useInitAuth();

  if (isAuthChecking) {
    return <Spin spinning fullscreen tip="Đang xác thực người dùng..." />;
  }

  return <Outlet />;
};

export default RootLayout;
