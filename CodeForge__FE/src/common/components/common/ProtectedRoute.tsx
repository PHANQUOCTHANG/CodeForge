import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/app/store/store";
import { Button, Result, Spin } from "antd";

/**
 * ✅ ProtectedRoute
 * - Bảo vệ route yêu cầu đăng nhập
 * - Có thể giới hạn role: admin, teacher, student, ...
 */
const ProtectedRoute: React.FC<{ requiredRole?: string }> = ({
  requiredRole,
}) => {
  const navigate = useNavigate();
  const { token, user, isAuthChecking } = useAppSelector((state) => state.auth);

  // 1️⃣ Đang xác thực (ví dụ đang gọi refreshToken)
  if (isAuthChecking) {
    return <Spin tip="Đang xác thực..." fullscreen />;
  }

  // 2️⃣ Chưa đăng nhập → yêu cầu login
  if (!token) {
    return (
      <Result
        status="403"
        title="Yêu cầu đăng nhập"
        subTitle="Vui lòng đăng nhập để truy cập nội dung này."
        extra={
          <Button type="primary" onClick={() => navigate("/login")}>
            Đăng nhập
          </Button>
        }
      />
    );
  }

  // 3️⃣ Kiểm tra role (nếu route có yêu cầu)
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <Result
        status="403"
        title="403 - Không có quyền truy cập"
        subTitle="Xin lỗi! Bạn không có quyền vào trang này."
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Quay lại trang chủ
          </Button>
        }
      />
    );
  }

  // 4️⃣ Đã xác thực hợp lệ → cho phép truy cập
  return <Outlet />;
};

export default ProtectedRoute;
