import { Facebook, Github, Linkedin, Youtube } from "lucide-react";
import { motion } from "framer-motion";
import "./Footer.scss";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__grid">
          {/* Brand Section */}
          <div className="footer__brand">
            <Link className="footer__logo" to="/">
              <motion.div
                whileHover={{ scale: 1.1, rotateY: 180 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span>T²VP</span>
              </motion.div>
              <motion.span
                className="footer__logo--code"
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                CODE
              </motion.span>
              <motion.span
                className="footer__logo--learn"
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                FORGE
              </motion.span>
            </Link>
            <p className="footer__description">
              Trao quyền cho thế hệ lập trình viên tiếp theo thông qua học tập
              tương tác và thực hành.
            </p>
            <div className="footer__social">
              <a href="#" className="footer__social-link">
                <Facebook />
              </a>
              <a href="#" className="footer__social-link">
                <Youtube />
              </a>
              <a href="#" className="footer__social-link">
                <Github />
              </a>
              <a href="#" className="footer__social-link">
                <Linkedin />
              </a>
            </div>
          </div>

          {/* Courses */}
          <div className="footer__nav">
            <h3 className="footer__nav-title">Khóa học</h3>
            <ul className="footer__list">
              <li className="footer__item">
                <a href="#">JavaScript</a>
              </li>
              <li className="footer__item">
                <a href="#">Python</a>
              </li>
              <li className="footer__item">
                <a href="#">React</a>
              </li>
              <li className="footer__item">
                <a href="#">Node.js</a>
              </li>
              <li className="footer__item">
                <a href="#">Khoa học dữ liệu</a>
              </li>
              <li className="footer__item">
                <a href="#">Machine Learning</a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer__nav">
            <h3 className="footer__nav-title">Tài nguyên</h3>
            <ul className="footer__list">
              <li className="footer__item">
                <a href="#">Tài liệu</a>
              </li>
              <li className="footer__item">
                <a href="#">Hướng dẫn</a>
              </li>
              <li className="footer__item">
                <a href="#">Blog</a>
              </li>
              <li className="footer__item">
                <a href="#">Cộng đồng</a>
              </li>
              <li className="footer__item">
                <a href="#">Trung tâm trợ giúp</a>
              </li>
              <li className="footer__item">
                <a href="#">Định hướng nghề nghiệp</a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer__nav">
            <h3 className="footer__nav-title">Công ty</h3>
            <ul className="footer__list">
              <li className="footer__item">
                <a href="#">Về chúng tôi</a>
              </li>
              <li className="footer__item">
                <a href="#">Tuyển dụng</a>
              </li>
              <li className="footer__item">
                <a href="#">Truyền thông</a>
              </li>
              <li className="footer__item">
                <a href="#">Liên hệ</a>
              </li>
              <li className="footer__item">
                <a href="#">Chính sách bảo mật</a>
              </li>
              <li className="footer__item">
                <a href="#">Điều khoản dịch vụ</a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="footer__divider" />

        <div className="footer__bottom">
          <p className="footer__copy">
            © 2025 CodeForge. Bản quyền thuộc về chúng tôi.
          </p>
          <p className="footer__tagline">
            Được tạo nên với ❤️ dành cho những lập trình viên tương lai
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
