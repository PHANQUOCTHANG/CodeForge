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
      title: "Interactive Learning",
      description:
        "Learn by doing with hands-on exercises and real-time feedback on your code.",
    },
    {
      icon: Trophy,
      title: "Gamified Progress",
      description:
        "Earn points, badges, and certificates as you complete challenges and courses.",
    },
    {
      icon: Users,
      title: "Community Support",
      description:
        "Connect with fellow learners, get help, and share your coding journey.",
    },
    {
      icon: Code,
      title: "Real Code Editor",
      description:
        "Practice in a professional IDE environment with syntax highlighting and debugging.",
    },
    {
      icon: BookOpen,
      title: "Comprehensive Curriculum",
      description:
        "Structured learning paths from basics to advanced topics in multiple languages.",
    },
    {
      icon: Target,
      title: "Project-Based Learning",
      description:
        "Build real projects and add them to your portfolio as you learn.",
    },
    {
      icon: Clock,
      title: "Learn at Your Pace",
      description:
        "Self-paced courses that fit your schedule with 24/7 access to content.",
    },
    {
      icon: Award,
      title: "Industry Recognition",
      description:
        "Earn certificates recognized by top tech companies and hiring managers.",
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
            Why Choose CodeLearn?
          </motion.h2>
          <motion.p
            className="features__subtitle"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Our platform is designed to make learning programming engaging,
            effective, and accessible to everyone.
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
