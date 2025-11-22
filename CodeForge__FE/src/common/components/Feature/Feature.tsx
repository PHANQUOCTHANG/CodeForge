import {
  Brain,
  Trophy,
  Users,
  Code,
  BookOpen,
  Target,
  Clock,
  Award,
} from "lucide-react";
import "./Feature.scss";
import { motion } from "framer-motion";

export function Features() {
  const features = [
    {
      icon: Brain,
      title: "Học Tập Tương Tác",
      description:
        "Học bằng cách thực hành với bài tập trực quan và phản hồi thời gian thực cho code của bạn.",
    },
    {
      icon: Trophy,
      title: "Tiến Trình Game Hoá",
      description:
        "Nhận điểm, huy hiệu và chứng nhận khi bạn hoàn thành thử thách và khoá học.",
    },
    {
      icon: Users,
      title: "Cộng Đồng Hỗ Trợ",
      description:
        "Kết nối với người học khác, nhận trợ giúp và chia sẻ hành trình lập trình của bạn.",
    },
    {
      icon: Code,
      title: "Trình Soạn Thảo Code Thực",
      description:
        "Luyện tập trong môi trường IDE chuyên nghiệp với highlight cú pháp và debugging.",
    },
    {
      icon: BookOpen,
      title: "Lộ Trình Học Đầy Đủ",
      description:
        "Lộ trình học tập từ cơ bản đến nâng cao cho nhiều ngôn ngữ lập trình.",
    },
    {
      icon: Target,
      title: "Học Qua Dự Án",
      description:
        "Xây dựng dự án thực tế và thêm vào portfolio khi bạn tiến bộ.",
    },
    {
      icon: Clock,
      title: "Học Theo Tốc Độ Của Bạn",
      description:
        "Khoá học tự chọn thời gian, phù hợp với lịch trình của bạn và có thể học 24/7.",
    },
    {
      icon: Award,
      title: "Chứng Nhận Uy Tín",
      description:
        "Nhận chứng nhận được công nhận bởi nhiều công ty công nghệ và nhà tuyển dụng.",
    },
  ];

  return (
    <section className="features">
      <div className="features__container">
        <div className="features__header">
          <motion.h2
            className="features__title"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Vì Sao Chọn CodeLearn?
          </motion.h2>

          <motion.p
            className="features__subtitle"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Nền tảng của chúng tôi được thiết kế để giúp việc học lập trình trở
            nên thú vị, hiệu quả và dễ tiếp cận với mọi người.
          </motion.p>
        </div>

        <div className="features__grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="features__card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="features__icon">
                <feature.icon />
              </div>
              <h3 className="features__card-title">{feature.title}</h3>
              <p className="features__card-description">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
