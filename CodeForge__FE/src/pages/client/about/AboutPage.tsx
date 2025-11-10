import React, { useEffect, useRef, useState } from "react";
import "./AboutPage.scss";
import { ImageWithFallback } from "@/common/components/ImageWithFallback/ImageWithFallback";
import { motion } from "framer-motion";
import {
  Heart,
  Users,
  Target,
  Globe,
  BookOpen,
} from "lucide-react";
import { FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";

const AboutPage: React.FC = () => {
  {/* Section 3 */}
  const statsData = [
  { value: 100000, label: "Happy Learners", sub: "Students worldwide" },
  { value: 500, label: "Courses", sub: "And growing daily" },
  { value: 50, label: "Expert Instructors", sub: "Industry professionals" },
  { value: 95, label: "Success Rate", sub: "Course completion", suffix: "%" },
];
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);
  {/* Section 4 */}
  const values = [
  {
    icon: <Heart className="icon text-blue-600" />,
    title: "Passion for Learning",
    desc: "We believe learning should be exciting, not exhausting. Every lesson is crafted with love and enthusiasm.",
  },
  {
    icon: <Users className="icon text-blue-600" />,
    title: "Community First",
    desc: "Learning together is better than learning alone. We foster a supportive, inclusive community for all.",
  },
  {
    icon: <Target className="icon text-blue-600" />,
    title: "Goal-Oriented",
    desc: "Every course is designed with clear learning outcomes and practical skills you can apply immediately.",
  },
  {
    icon: <Globe className="icon text-blue-600" />,
    title: "Accessible Education",
    desc: "Quality programming education should be available to everyone, everywhere, regardless of background.",
  },
];
{/* Section 4 */}
const team = [
  {
    name: "Sarah Chen",
    role: "Founder & CEO",
    description:
      "Former Google engineer passionate about making coding education accessible to everyone.",
    image: "https://github.com/shadcn.png",
    badges: ["Leadership", "JavaScript", "Education"],
  },
  {
    name: "Liam Tran",
    role: "Lead Instructor",
    description:
      "Full-stack developer with a passion for teaching and building high-quality web apps.",
    image: "https://github.com/vercel.png",
    badges: ["React", "Node.js", "Mentorship"],
  },
  {
    name: "Emma Nguyen",
    role: "UI/UX Designer",
    description:
      "Designs intuitive and beautiful user experiences that make learning enjoyable.",
    image: "https://github.com/github.png",
    badges: ["Figma", "Design Systems", "Accessibility"],
  },
  {
    name: "Daniel Vo",
    role: "Community Manager",
    description:
      "Connects learners and mentors through engaging events and online communities.",
    image: "https://github.com/microsoft.png",
    badges: ["Community", "Events", "Engagement"],
  },
];
{/* Section 6 */}
const milestones = [
  { year: "2020", emoji: "🚀", title: "The Beginning", desc: "CodeLearn was founded with a simple mission: make coding education fun and accessible." },
  { year: "2021", emoji: "🎯", title: "First 1,000 Students", desc: "Reached our first major milestone with students from 50+ countries." },
  { year: "2022", emoji: "💻", title: "Interactive Platform Launch", desc: "Launched our revolutionary interactive coding environment." },
  { year: "2023", emoji: "👥", title: "Community Platform", desc: "Introduced community features, study groups, and peer learning." },
  { year: "2024", emoji: "🤖", title: "AI-Powered Learning", desc: "Integrated AI tutors and personalized learning paths." },
  { year: "2025", emoji: "🌍", title: "Global Impact", desc: "Empowering 100,000+ learners worldwide to achieve their coding dreams." },
];
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
      {/* Section 3 */}
      <section ref={sectionRef} className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {statsData.map((item, index) => (
            <StatCard
              key={index}
              value={item.value}
              label={item.label}
              sub={item.sub}
              visible={visible}
              suffix={item.suffix}
            />
          ))}
        </div>
      </div>
    </section>
    {/* Section 4 */}
    <section className="section4 container">
      <div className="header">
        <h2>What We Stand For</h2>
        <p>
          Our core values guide everything we do, from course creation to
          community building
        </p>
      </div>

      <div className="card-grid">
        {values.map((item, i) => (
          <div className="card" key={i}>
            <div className="icon-wrap">{item.icon}</div>
            <h4>{item.title}</h4>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
    {/* Section 5 */}
    <section>
      <section className="team-section">
      <div className="team-container">
        <div className="team-header">
          <h2>Meet Our Team</h2>
          <p>
            Passionate educators, developers, and dreamers working together to
            transform coding education.
          </p>
        </div>

        <div className="team-grid">
          {team.map((member, index) => (
            <motion.div
              key={index}
              className="team-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="team-avatar">
                <img src={member.image} alt={member.name} />
              </div>
              <h4>{member.name}</h4>
              <div className="team-role">{member.role}</div>
              <p className="team-desc">{member.description}</p>
              <div className="team-badges">
                {member.badges.map((badge, i) => (
                  <span key={i}>{badge}</span>
                ))}
              </div>
              <div className="team-socials">
                <button aria-label="LinkedIn">
                  <FaLinkedin />
                </button>
                <button aria-label="Twitter">
                  <FaTwitter />
                </button>
                <button aria-label="Email">
                  <FaEnvelope />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
    </section>
    {/* Section 6 */}
    <section id="journey">
      <div className="text-center">
        <h2>Our Journey</h2>
        <p>From a simple idea to empowering thousands of learners worldwide</p>
      </div>

      <div className="timeline">
        {milestones.map((item, index) => (
          <div key={index} className="timeline-item">
            <div className="icon">{item.emoji}</div>

            <div className="content">
              <div className="title-line">
                <span className="year">{item.year}</span>
                <h3>{item.title}</h3>
              </div>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
    {/* Section 7 */}
    <section className="join-mission">
      <div className="join-container">
        <h2 className="join-title">Join Our Mission</h2>
        <p className="join-desc">
          Whether you're a learner, educator, or just passionate about coding
          education, there's a place for you in our community. Let's build the
          future of learning together! 🌟
        </p>

        <div className="join-buttons">
          <button className="btn btn-primary">
            <Users className="icon" />
            Join Community
          </button>

          <button className="btn btn-outline">
            <BookOpen className="icon" />
            Start Learning
          </button>
        </div>
      </div>
    </section>
    </>
  );
};
{/* Section 3 */}
interface StatCardProps {
  value: number;
  label: string;
  sub: string;
  visible: boolean;
  suffix?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  sub,
  visible,
  suffix = "",
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const duration = 2000; // 2s
    const stepTime = 20;
    const increment = value / (duration / stepTime);

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [visible, value]);

  const displayValue =
    value >= 1000 ? `${count.toLocaleString()}${suffix}` : `${count}${suffix}`;

  return (
    <div className="stat-card fade-in">
      <div className="stat-value">{displayValue}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-sub">{sub}</div>
    </div>
  );
};

export default AboutPage;
