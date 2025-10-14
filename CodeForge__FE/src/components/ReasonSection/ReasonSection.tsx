import React from "react";
import { motion } from "framer-motion";
import "./ReasonSection.scss";
import { ImageWithFallback } from "@/components/ImageWithFallback/ImageWithFallback";
import img1 from "../../assets/img/ReasonSectionP1.png";
import img2 from "../../assets/img/ReasonSectionP2.png.png";
import img3 from "../../assets/img/ReasonSectionP3.png.png";
export default function ReasonSection() {
  const reasons = [
    {
      img: img1,
      heading: "Develop logical thinking and problem solving abilities",
      text: "Programming helps students practice logical thinking and problem-solving skills systematically and creatively.",
    },
    {
      img: img2,
      heading: "Participate in large-scale programming competitions",
      text: "CodeLearn organizes programming competitions that gather hundreds of domestic and foreign teams. Students have the opportunity to compete and gain experience after each competition.",
    },
    {
      img: img3,
      heading: "Attractive job opportunities in the future",
      text: "Approaching the language of the 4.0 era helps students open up job opportunities with attractive salaries in the future.",
    },
  ];

  return (
    <section className="reason">
      <div className="reason__container">
        <div className="reason__header">
          <motion.h2
            className="reason__title"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Why should students learn programming early?
          </motion.h2>
        </div>

        <div className="reason__list">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              className="reason__item"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="reason__image">
                <ImageWithFallback src={reason.img} alt={reason.heading} />
              </div>
              <div className="reason__content">
                <h3 className="reason__heading">{reason.heading}</h3>
                <p className="reason__text">{reason.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
