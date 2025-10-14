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
                LEARN
              </motion.span>
            </Link>
            <p className="footer__description">
              Empowering the next generation of developers through interactive,
              practical coding education.
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
            <h3 className="footer__nav-title">Courses</h3>
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
                <a href="#">Data Science</a>
              </li>
              <li className="footer__item">
                <a href="#">Machine Learning</a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer__nav">
            <h3 className="footer__nav-title">Resources</h3>
            <ul className="footer__list">
              <li className="footer__item">
                <a href="#">Documentation</a>
              </li>
              <li className="footer__item">
                <a href="#">Tutorials</a>
              </li>
              <li className="footer__item">
                <a href="#">Blog</a>
              </li>
              <li className="footer__item">
                <a href="#">Community</a>
              </li>
              <li className="footer__item">
                <a href="#">Help Center</a>
              </li>
              <li className="footer__item">
                <a href="#">Career Guide</a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer__nav">
            <h3 className="footer__nav-title">Company</h3>
            <ul className="footer__list">
              <li className="footer__item">
                <a href="#">About Us</a>
              </li>
              <li className="footer__item">
                <a href="#">Careers</a>
              </li>
              <li className="footer__item">
                <a href="#">Press</a>
              </li>
              <li className="footer__item">
                <a href="#">Contact</a>
              </li>
              <li className="footer__item">
                <a href="#">Privacy Policy</a>
              </li>
              <li className="footer__item">
                <a href="#">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="footer__divider" />

        <div className="footer__bottom">
          <p className="footer__copy">© 2025 CodeLearn. All rights reserved.</p>
          <p className="footer__tagline">
            Made with ❤️ for aspiring developers
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
