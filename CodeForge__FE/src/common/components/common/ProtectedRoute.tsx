import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "@/app/store/store";
import { Spin } from "antd";

/**
 * ✅ ProtectedRoute.tsx
 * - Dùng để bảo vệ các route cần đăng nhập
 * - Có thể mở rộng cho quyền admin / user khác nhau
 */
const ProtectedRoute: React.FC<{ requiredRole?: string }> = ({
  requiredRole,
}) => {
  const location = useLocation();
  const { token, user, isAuthChecking } = useAppSelector((state) => state.auth);

  // ⏳ 1. Đang kiểm tra trạng thái đăng nhập
  if (!isAuthChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin tip="Đang xác thực..." size="large" fullscreen={false} />
      </div>
    );
  }

  // ❌ 2. Nếu chưa đăng nhập → quay về trang login
  if (!token) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }} // lưu lại trang gốc để quay lại sau login
        replace
      />
    );
  }

  // ⚙️ 3. Nếu có yêu cầu quyền hạn (ví dụ admin) → kiểm tra role
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/403" replace />; // trang lỗi quyền truy cập
  }

  // ✅ 4. Nếu hợp lệ → render trang con (route con trong <Outlet />)
  return <Outlet />;
};

export default ProtectedRoute;
