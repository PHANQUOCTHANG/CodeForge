import React from "react";
import "./AboutPage.scss";
import { ImageWithFallback } from "@/common/components/ImageWithFallback/ImageWithFallback";
import { motion } from "framer-motion";

const AboutPage: React.FC = () => {
  return (
    <>
      {/* Section 1 */}
      <section className="hero">
        <div className="hero__container">
          <div className="hero__grid">
            {/* Left Content */}
            <div className="about__content">
              <h2 className="about__title">
                About <span className="about__highlight">CodeLearn</span>
              </h2>

              <p className="about__desc">
                We’re on a mission to make coding education accessible,
                engaging, and effective for everyone around the world. 🌍
              </p>

              <div className="about__tags">
                <span className="about__tag about__tag--green">
                  🟢 Founded in 2020
                </span>
                <span className="about__tag about__tag--blue">
                  🔵 100% Remote Team
                </span>
                <span className="about__tag about__tag--purple">
                  🟣 Global Impact
                </span>
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
                Made with ❤️
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section className="mission">
        <div className="mission__container">
          <h2 className="mission__title">Our Mission</h2>
          <p className="mission__desc">
            To democratize programming education by creating the world's most
            engaging, effective, and accessible coding learning platform. We
            believe that everyone deserves the opportunity to learn, grow, and
            succeed in tech. 🚀
          </p>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
