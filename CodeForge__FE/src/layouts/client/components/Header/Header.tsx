import { NavLink, Link } from "react-router-dom";
import "./Header.scss";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  X,
  Home,
  Menu,
  CircleUserRound,
  BookText,
  NotebookPen,
  LogIn,
  UserRoundPen,
} from "lucide-react";
import { Avatar, Popover, Tooltip } from "antd";
import CustomButton from "@/common/components/Ui/Button/CustomButton";
import { useAppSelector } from "@/app/store/store";

const navItems = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Courses", icon: BookText, path: "/courses" },
  { label: "Practice", icon: NotebookPen, path: "/practice" },
  { label: "Contact", icon: Home, path: "/contact" },
  { label: "Community", icon: Home, path: "/community" },
  { label: "Login", icon: LogIn, path: "/login" },
  { label: "Register", icon: UserRoundPen, path: "/register" },
  { label: "About", icon: UserRoundPen, path: "/about" },
  // { label: "Log out", icon: LogOut, path: "/log-out" },
];

const content = (
  <div className="userContent">
    <ul>
      <li>
        <Link to="/log-out">Log out</Link>
      </li>
    </ul>
  </div>
);

const Header = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <motion.div className="header" initial={{ y: -100 }} animate={{ y: 0 }}>
        <div className="header__container">
          {/* Logo */}
          <Link className="header__logo" to="/">
            <motion.div
              whileHover={{ scale: 1.1, rotateY: 180 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span>T²VP</span>
            </motion.div>
            <motion.span
              className="header__logo--code"
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              CODE
            </motion.span>
            <motion.span
              className="header__logo--learn"
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              LEARN
            </motion.span>
          </Link>

          {/* Navbar (Desktop) */}
          <nav className="header__nav">
            {navItems.map((item, index) => {
              if (item.label === "Login" || item.label === "Register") return;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileHover={{ y: -2 }}
                >
                  <NavLink
                    to={item.path}
                    end={false}
                    className={({ isActive }) =>
                      `header__link${isActive ? " header__link--active" : ""}`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.label}
                        <motion.div
                          className="header__underline"
                          initial={{ width: 0, opacity: 0 }}
                          animate={{
                            width: isActive ? "100%" : 0,
                            opacity: isActive ? 1 : 0,
                          }}
                          transition={{
                            duration: 0.3,
                            ease: "easeInOut",
                          }}
                        />
                      </>
                    )}
                  </NavLink>
                </motion.div>
              );
            })}
          </nav>

          {/* User / Menu */}
          <motion.div className="header__more">
            <div className="header__actions">
              {user ? (
                <Popover placement="bottomRight" content={content}>
                  <Tooltip placement="left" title={user.email}>
                    <div
                      className="user__avartar"
                      style={{ cursor: "pointer" }}
                    >
                      <Avatar size="default" icon={<CircleUserRound />} />
                    </div>
                  </Tooltip>
                </Popover>
              ) : (
                <>
                  <CustomButton className="btn--login" variant="login">
                    <Link to="/login">Login</Link>
                  </CustomButton>
                  <CustomButton className="btn--register" variant="register">
                    <Link to="/register">Register</Link>
                  </CustomButton>
                </>
              )}

              {/* Mobile Menu Toggle */}
              <CustomButton
                variant="menu"
                className="btn--register"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMobileMenuOpen ? <X /> : <Menu />}
                </motion.div>
              </CustomButton>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="header-mobile"
          >
            <nav className="header-mobile__nav">
              {navItems.map((item, index) => {
                if (
                  user &&
                  (item.label === "Login" || item.label === "Register")
                )
                  return;
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    className="header-mobile__item"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <NavLink
                      to={item.path}
                      end={false}
                      className={({ isActive }) =>
                        `header-mobile__link${
                          isActive ? " header-mobile__link--active" : ""
                        }`
                      }
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="header-mobile__icon" />
                      <span className="header-mobile__label">{item.label}</span>
                    </NavLink>
                  </motion.div>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
