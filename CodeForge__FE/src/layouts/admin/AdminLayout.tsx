import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/common/components/admin/Sidebar/Sidebar";
import Navbar from "@/common/components/admin/Navbar/Navbar";
import styles from "./AdminLayout.module.scss";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // 🧠 Map đường dẫn sang tiêu đề hiển thị trên Navbar
  const pageTitles: Record<string, string> = {
    "/admin/dashboard": "Dashboard ",
    "/admin/users": "Quản lý học viên",
    "/admin/courses": "Quản lý khóa học",
    "/admin/courses-category": "Danh mục khóa học",
    "/admin/assignments": "Quản lý bài tập",
    "/admin/submissions": "Quản lí bài nộp",
  };

  // Nếu không khớp route nào, dùng mặc định
  const pageTitle = pageTitles[location.pathname] || "Trang quản trị";

  return (
    <div className={styles.adminLayout}>
      {/* ✅ Sidebar ẩn/hiện theo trạng thái */}
      {!collapsed && (
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      )}

      <div className={styles.main}>
        {/* ✅ Truyền pageTitle xuống Navbar */}
        <Navbar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          pageTitle={pageTitle}
        />

        {/* ✅ Khu vực hiển thị nội dung động */}
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
