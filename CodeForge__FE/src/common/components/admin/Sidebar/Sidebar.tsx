import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.scss";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Code,
  FileText,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
  const menu = [
    { label: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
    { label: "Học viên", path: "/admin/users", icon: <Users size={20} /> },
    { label: "Khóa học", path: "/admin/courses", icon: <BookOpen size={20} /> },
    { label: "Bài tập", path: "/admin/problems", icon: <Code size={20} /> },
    { label: "Bài nộp", path: "/admin/submissions", icon: <FileText size={20} /> },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setCollapsed(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setCollapsed]);

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      {/* Logo */}
      <div className={styles.logo} onClick={() => setCollapsed(!collapsed)}>
        <div className={styles.icon}>{"</>"}</div>
        {!collapsed && (
          <div>
            <h1>CodeForge</h1>
            <p>Admin Panel</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            <span className={styles.icon}>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Admin Profile */}
      <div className={styles.profile}>
        <div className={styles.avatar}>A</div>
        {!collapsed && (
          <div>
            <p className={styles.name}>Admin</p>
            <p className={styles.email}>admin@codeforge.com</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
