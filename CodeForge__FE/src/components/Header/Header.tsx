import { Link, useLocation } from "react-router-dom";
import "./Header.scss";
import { AnimatePresence, motion } from "framer-motion";

import { useState } from "react";
import { X, Home, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
const navItems = [
  { label: "Trang chủ", icon: Home, path: "/" },
  { label: "Khóa học", icon: Home, path: "/courses" },
  { label: "Thực hành", icon: Home, path: "/practice" },
  { label: "Liên hệ", icon: Home, path: "/contact" },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  console.log(location.pathname);
  return (
    <>
      <motion.div className="header" initial={{ y: -100 }} animate={{ y: 0 }}>
        <div className="header__container">
          <Link className="header__logo" to="/">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 180 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span>T²VP</span>
            </motion.div>
            <span>CODELEARN</span>
          </Link>
          <nav className="header__nav">
            {navItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={{ y: -2 }}
              >
                <Link
                  to={item.path}
                  className={`header__link${
                    location.pathname === item.path
                      ? " header__link--active"
                      : ""
                  }`}
                >
                  {item.label}

                  {/* underline animation */}
                  <motion.div
                    className="header__underline"
                    initial={{
                      width: location.pathname === item.path ? "100%" : "0%",
                    }}
                    animate={{
                      width: location.pathname === item.path ? "100%" : "0%",
                    }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            ))}
          </nav>
          <motion.div className="header__more">
            <div className="header__actions">
              <Button className="btn--login">
                <Link to="/login">Đăng nhập</Link>
              </Button>
              <Button>
                <Link to="/register">Đăng ký</Link>
              </Button>
              <Button
                className="header__menu-button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMobileMenuOpen ? <X /> : <Menu />}
                </motion.div>
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>
      {/* //Mobile */}
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="header-mobile"
          >
            <div className="header-mobile__container">
              <nav className="header-mobile__nav">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.label}
                      className="header-mobile__item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 5 }}
                    >
                      <Link
                        to={item.path}
                        className={`header-mobile__link${
                          location.pathname === item.path
                            ? " header-mobile__link--active"
                            : ""
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="header-mobile__icon" />
                        <span className="header-mobile__label">
                          {item.label}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
export default Header;
