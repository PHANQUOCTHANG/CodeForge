import React from "react";
import { ArrowRight, Sparkles, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import "./Hero.scss";
import { Button } from "antd";
import { ImageWithFallback } from "@/common/components/ImageWithFallback/ImageWithFallback";
import { motion } from "framer-motion";
export function Hero() {
  return (
    <section className="hero">
      {/* Floating Elements */}
      <motion.div
        className="hero__floating hero__floating--star"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        ✨
      </motion.div>
      <motion.div
        className="hero__floating hero__floating--rocket"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        🚀
      </motion.div>
      <motion.div
        className="hero__floating hero__floating--laptop"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        💻
      </motion.div>

      <div className="hero__container">
        <div className="hero__grid">
          {/* Left Content */}
          <div className="hero__content">
            <motion.div
              className="hero__badge"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            >
              <Sparkles className="hero__badge-icon" />
              <motion.span
                className="hero__badge-text"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Enter the world of programming!
              </motion.span>
            </motion.div>

            <motion.h1
              className="hero__title"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Learn to <span className="hero__title-gradient">Code</span> with
              Friends! 👋
            </motion.h1>

            <motion.p
              className="hero__subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              Master programming languages through hands-on practice, real-world
              projects, and a super supportive community.
              <span className="hero__subtitle-highlight">
                We make coding fun! <Heart className="hero__heart" />
              </span>
            </motion.p>

            <motion.div
              className="hero__actions"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <Link to="/courses">
                <Button className="hero__btn hero__btn--primary">
                  Start Learning Free 🎉
                  <ArrowRight className="hero__btn-icon" />
                </Button>
              </Link>
            </motion.div>

            <div className="hero__testimonial">
              <p className="hero__testimonial-title">
                💬 What our learners say:
              </p>
              <p className="hero__testimonial-text">
                "From zero to landing my first dev job in 6 months! CodeLearn
                made it possible."
                <span className="hero__testimonial-author">
                  - Sarah K.
                </span>{" "}
                ⭐⭐⭐⭐⭐
              </p>
            </div>
          </div>

          {/* Right Content */}
          <div className="hero__image-wrapper">
            <motion.div
              className="hero__image-bg"
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 0.9, delay: 0.3, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            />
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1520569495996-b5e1219cb625?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
              alt="Happy students learning coding together"
              className="hero__image"
            />
            <div className="hero__badge-floating hero__badge-floating--top">
              🏆 Coding Platform Effectivelly
            </div>
            <div className="hero__badge-floating hero__badge-floating--bottom">
              ✅ Success Rate Study
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Hero;
