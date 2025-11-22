import { useAppSelector } from "@/app/store/store";
import styles from "./Navbar.module.scss";
import { Avatar, Popover, Tooltip } from "antd";
import { CircleUserRound } from "lucide-react";
import { Link } from "react-router-dom";

interface NavbarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  pageTitle: string; // 🆕 thêm prop
}
const content = (
  <div className="userContent">
    <ul>
      <li>
        <Link to="/log-out">Log out</Link>
      </li>
    </ul>
  </div>
);
const Navbar = ({ collapsed, setCollapsed, pageTitle }: NavbarProps) => {
  const { user } = useAppSelector((state) => state.auth);
  return (
    <header className={styles.navbar}>
      <button
        className={styles.toggle}
        onClick={() => setCollapsed(!collapsed)}
      >
        ☰
      </button>
      <h1 className={styles.title}>{pageTitle}</h1> {/* 🆕 dùng prop */}
      <div className={styles.profile}>
        <Popover placement="bottomRight" content={content}>
          <Tooltip placement="left" title={user.email}>
            <div className="user__avartar" style={{ cursor: "pointer" }}>
              <Avatar size="default" icon={<CircleUserRound />} />
            </div>
          </Tooltip>
        </Popover>
      </div>
    </header>
  );
};

export default Navbar;
