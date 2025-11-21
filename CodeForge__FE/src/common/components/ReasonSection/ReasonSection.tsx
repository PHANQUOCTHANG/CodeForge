import React from "react";
import { motion } from "framer-motion";
import "./ReasonSection.scss";
import { ImageWithFallback } from "@/common/components/ImageWithFallback/ImageWithFallback";
import img1 from "@/assets/img/ReasonSectionP1.png";
import img2 from "@/assets/img/ReasonSectionP2.png";
import img3 from "@/assets/img/ReasonSectionP3.png";
export default function ReasonSection() {
  const reasons = [
    {
      img: img1,
      heading: "Phát triển tư duy logic và khả năng giải quyết vấn đề",
      text: "Lập trình giúp học sinh rèn luyện tư duy logic và khả năng giải quyết vấn đề một cách hệ thống và sáng tạo.",
    },
    {
      img: img2,
      heading: "Tham gia các cuộc thi lập trình quy mô lớn",
      text: "CodeLearn tổ chức các cuộc thi lập trình thu hút hàng trăm đội trong nước và quốc tế. Học sinh có cơ hội tranh tài và tích lũy kinh nghiệm sau mỗi cuộc thi.",
    },
    {
      img: img3,
      heading: "Cơ hội việc làm hấp dẫn trong tương lai",
      text: "Tiếp cận ngôn ngữ của thời đại 4.0 giúp học sinh mở ra cơ hội việc làm với mức lương hấp dẫn trong tương lai.",
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
            Vì sao học sinh nên học lập trình từ sớm?
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
