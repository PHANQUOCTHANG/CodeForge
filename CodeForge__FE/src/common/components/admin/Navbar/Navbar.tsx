import styles from "./Navbar.module.scss";

interface NavbarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  pageTitle: string; // 🆕 thêm prop
}

const Navbar = ({ collapsed, setCollapsed, pageTitle }: NavbarProps) => {
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
        <img
          src="@/assets/img/ReasonSectionP2.png"
          alt="Admin"
          className={styles.avatar}
        />
      </div>
    </header>
  );
};

export default Navbar;
