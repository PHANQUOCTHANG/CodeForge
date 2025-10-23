import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  Clock,
  Users,
  Award,
  Star,
  Play,
  ChevronDown,
  ChevronUp,
  Code,
  FileText,
  Video,
  CheckCircle,
  Lock,
  Share2,
  Heart,
  ShoppingCart,
} from "lucide-react";
import "./CoursePageDetail.scss";
import { useParams } from "react-router-dom";
// Types - Updated to match API response
interface Module {
  moduleId: string;
  courseId: string;
  title: string;
  orderIndex: number;
  isDeleted: boolean;
  lessons: Lesson[];
}

interface Lesson {
  lessonId: string;
  moduleId: string;
  title: string;
  lessonType: "video" | "text" | "quiz" | "coding";
  orderIndex: number;
  isDeleted: boolean;
  content?: string;
  videoUrl?: string;
  codingProblem?: CodingProblems;
  isCompleted?: boolean;
  isLocked?: boolean;
}
interface CodingProblems {
  problemId: string;
  title: string;
  difficulty: string;
  description: string;
  timeLimit: number;
  memoryLimit: number;
}

interface Course {
  courseId: string;
  title: string;
  slug: string;
  description: string;
  overview: string | null;
  level: string;
  language: string;
  price: number;
  discount: number;
  duration: number;
  rating: number;
  thumbnail: string;
  totalRatings: number;
  totalStudents: number;
  categoryName: string;
  author: string;
  modules: Module[];
  reviews: Review[];
}

interface Review {
  userId: string;
  usename: string;
  avatar: string;
  rating: number;
  comment: string;
  createdAt: string;
}

import { useQuery } from "@tanstack/react-query";
import { courseApi } from "@/api/courseApi";
import { Empty, Rate } from "antd";
const CourseDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: course, // ✅ 'course' bây giờ sẽ là object data bên trong
    isLoading,
    isError,
  } = useQuery<Course>({
    // Giả sử type 'Course' là { courseId: ..., title: ... }
    queryKey: ["course", slug],
    queryFn: () => courseApi.getBySlug(slug!),
    enabled: !!slug,
    staleTime: 300000,

    // 👇 THÊM DÒNG NÀY
    // 'apiResponse' là toàn bộ object { isSuccess, message, data... }
    select: (apiResponse) => apiResponse.data,
  });

  const reviews: Review[] = course?.reviews || [];
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set()
  );
  const [activeTab, setActiveTab] = useState<
    "overview" | "curriculum" | "reviews"
  >("overview");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [sidebarFixed, setSidebarFixed] = useState(false);
  const overviewRef = useRef<HTMLDivElement | null>(null);
  const curriculumRef = useRef<HTMLDivElement | null>(null);
  const reviewsRef = useRef<HTMLDivElement | null>(null);
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop - 100,
        behavior: "smooth",
      });
    }
  };

  // Mock data - Replace with actual API call
  useEffect(() => {
    // Handle scroll for sticky sidebar
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setSidebarFixed(true);
      } else {
        setSidebarFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video size={18} />;
      case "text":
        return <FileText size={18} />;
      case "coding":
        return <Code size={18} />;
      case "quiz":
        return <Award size={18} />;
      default:
        return <BookOpen size={18} />;
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return price - (price * discount) / 100;
  };

  const finalPrice = calculateDiscountedPrice(course?.price, course?.discount);

  return (
    <>
      {/* Course Grid */}
      {isLoading ? (
        <div className="course-detail-loading">
          <div className="spinner"></div>
          <p>Đang tải khóa học...</p>
        </div>
      ) : isError ? (
        <Empty description="Lỗi khi tải dữ liệu" />
      ) : course == null || course.length === 0 ? (
        <Empty description="Không có khóa học nào" />
      ) : (
        <div className="course-detail-page">
          <div className="course-detail-page__container">
            <div className="course-detail-page__main">
              {/* Hero Section */}
              <section className="course-hero">
                <div className="course-hero__container">
                  <div className="course-hero__content">
                    <h1 className="course-hero__title">{course.title}</h1>
                    <p className="course-hero__description">
                      {course.description}
                    </p>

                    <div className="course-hero__meta">
                      <div className="course-hero__rating">
                        <span className="rating-value">{course.rating}</span>
                        <Rate disabled defaultValue={course.rating} />
                        <span className="rating-count">
                          ({course.totalRatings} đánh giá)
                        </span>
                      </div>

                      <div className="course-hero__students">
                        <Users size={18} />
                        <span>
                          {course.totalStudents.toLocaleString()} học viên
                        </span>
                      </div>

                      <div className="course-hero__level">
                        <Award size={18} />
                        <span>
                          {course.level === "beginner"
                            ? "Cơ bản"
                            : course.level === "intermediate"
                            ? "Trung cấp"
                            : "Nâng cao"}
                        </span>
                      </div>

                      <div className="course-hero__duration">
                        <Clock size={18} />
                        <span>{formatDuration(course.duration)}</span>
                      </div>
                    </div>

                    <div className="course-hero__instructor">
                      <img alt={course.author} />
                      <div>
                        <span className="instructor-label">Giảng viên</span>
                        <span className="instructor-name">{course.author}</span>
                      </div>
                    </div>
                  </div>

                  <div className="course-hero__thumbnail">
                    <img src={course.thumbnail} alt={course.title} />
                  </div>
                  <div className="course-card">
                    <div className="course-card__price">
                      <div>
                        <span className="final-price">
                          {formatPrice(finalPrice)}
                        </span>
                      </div>
                      {course.discount > 0 && (
                        <>
                          <div>
                            <span className="original-price">
                              {formatPrice(course.price)}
                            </span>
                            <span className="discount-badge">
                              -{course.discount}%
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {!isEnrolled ? (
                      <>
                        {course.price == 0 && (
                          <button className="btn btn-primary">
                            Đăng ký miễn phí
                          </button>
                        )}
                        {course.price != 0 && (
                          <button className="btn-buy-now">Mua ngay</button>
                        )}
                      </>
                    ) : (
                      <button className="btn-continue">
                        <Play size={20} />
                        Tiếp tục học
                      </button>
                    )}
                    <div className="course-card__includes">
                      <h4>Khóa học bao gồm:</h4>
                      <ul>
                        <li>
                          <Video size={18} /> {formatDuration(course.duration)}{" "}
                          video
                        </li>
                        <li>
                          <FileText size={18} /> Tài liệu học tập
                        </li>
                        <li>
                          <Code size={18} /> Bài tập thực hành
                        </li>
                        <li>
                          <Award size={18} /> Chứng chỉ hoàn thành
                        </li>
                        <li>
                          <Clock size={18} /> Truy cập trọn đời
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Main Content */}
              <div className="course-content">
                <div className="course-content__container">
                  <div className="course-content__main">
                    {/* Tabs */}
                    <div className="course-tabs">
                      <button
                        className={`tab ${
                          activeTab === "overview" ? "active" : ""
                        }`}
                        onClick={() => {
                          setActiveTab("overview");
                          scrollToSection(overviewRef);
                        }}
                      >
                        Tổng quan
                      </button>

                      <button
                        className={`tab ${
                          activeTab === "curriculum" ? "active" : ""
                        }`}
                        onClick={() => {
                          setActiveTab("curriculum");
                          scrollToSection(curriculumRef);
                        }}
                      >
                        Nội dung khóa học
                      </button>

                      <button
                        className={`tab ${
                          activeTab === "reviews" ? "active" : ""
                        }`}
                        onClick={() => {
                          setActiveTab("reviews");
                          scrollToSection(reviewsRef);
                        }}
                      >
                        Đánh giá ({course.totalRatings})
                      </button>
                    </div>

                    {/* Tab Content */}
                    <div className="course-tabs-content">
                      <div
                        ref={overviewRef}
                        className="overview-content"
                        dangerouslySetInnerHTML={{ __html: course.overview }}
                      />

                      <div className="curriculum-content" ref={curriculumRef}>
                        <div className="curriculum-header">
                          <h2>Nội dung khóa học</h2>
                          <p>
                            {course.modules.length} chương •{" "}
                            {course.modules.reduce(
                              (acc, m) => acc + m.lessons.length,
                              0
                            )}{" "}
                            bài học
                          </p>
                        </div>

                        <div className="modules-list">
                          {course.modules.map((module) => {
                            // ✅ Tạo map đếm loại bài học
                            const lessonTypeCount = module.lessons.reduce(
                              (acc: Record<string, number>, lesson) => {
                                acc[lesson.lessonType] =
                                  (acc[lesson.lessonType] || 0) + 1;
                                return acc;
                              },
                              {}
                            );

                            // ✅ Chuyển sang chuỗi để hiển thị (vd: "3 video, 2 coding, 1 quiz")
                            const typeSummary = Object.entries(lessonTypeCount)
                              .map(([type, count]) => `${count} ${type}`)
                              .join(" · ");

                            return (
                              <div
                                key={module.moduleId}
                                className="module-item"
                              >
                                <button
                                  className="module-header"
                                  onClick={() => toggleModule(module.moduleId)}
                                >
                                  <div className="module-info">
                                    <h3>
                                      Chương {module.orderIndex}: {module.title}
                                    </h3>
                                    <span className="lesson-count">
                                      {module.lessons.length} bài học (
                                      {typeSummary})
                                    </span>
                                  </div>
                                  {expandedModules.has(module.moduleId) ? (
                                    <ChevronUp size={20} />
                                  ) : (
                                    <ChevronDown size={20} />
                                  )}
                                </button>

                                {expandedModules.has(module.moduleId) && (
                                  <div className="lessons-list">
                                    {module.lessons.map((lesson) => (
                                      <div
                                        key={lesson.lessonId}
                                        className="lesson-item"
                                      >
                                        <div className="lesson-icon">
                                          {getLessonIcon(lesson.lessonType)}
                                        </div>
                                        <span className="lesson-title">
                                          {lesson.title}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="reviews-content" ref={reviewsRef}>
                        <div className="reviews-header">
                          <h2>Đánh giá từ học viên</h2>
                          <div className="reviews-summary">
                            <div className="rating-overview">
                              <div className="rating-number">
                                {course.rating}
                              </div>
                              <div className="stars">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={24}
                                    fill={
                                      i < Math.floor(course.rating)
                                        ? "#fbbf24"
                                        : "none"
                                    }
                                    color="#fbbf24"
                                  />
                                ))}
                              </div>
                              <div className="rating-text">
                                {course.totalRatings} đánh giá
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="reviews-list">
                          {reviews.map((review) => (
                            <div key={review.userId} className="review-item">
                              <img
                                // src={review.avatar}
                                alt={review.usename}
                                className="review-avatar"
                              />
                              <div className="review-content">
                                <div className="review-header">
                                  <h4>{review.usename}</h4>
                                  <span className="review-date">
                                    {new Date(
                                      review.createdAt
                                    ).toLocaleDateString("vi-VN")}
                                  </span>
                                </div>
                                <div className="review-stars">
                                  <Rate disabled defaultValue={review.rating} />
                                </div>
                                <p className="review-comment">
                                  {review.comment}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Sidebar */}
            <aside className={`course-sidebar ${sidebarFixed ? "fixed" : ""}`}>
              <div className="course-card">
                <div className="course-card__price">
                  {course.discount > 0 && (
                    <>
                      <span className="original-price">
                        {formatPrice(course.price)}
                      </span>
                      <span className="discount-badge">
                        -{course.discount}%
                      </span>
                    </>
                  )}
                  <span className="final-price">{formatPrice(finalPrice)}</span>
                </div>

                {!isEnrolled ? (
                  <>
                    {course.price == 0 && (
                      <button className="btn btn-primary">
                        Đăng ký miễn phí
                      </button>
                    )}
                    {course.price != 0 && (
                      <button className="btn-buy-now">Mua ngay</button>
                    )}
                  </>
                ) : (
                  <button className="btn-continue">
                    <Play size={20} />
                    Tiếp tục học
                  </button>
                )}

                <div className="course-card__actions">
                  <button
                    className={`btn-action ${isFavorite ? "active" : ""}`}
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <ShoppingCart
                      size={20}
                      fill={isFavorite ? "currentColor" : "none"}
                    />
                    Thêm vào giỏ hàng
                  </button>
                  <button className="btn-action">
                    <Share2 size={20} />
                    Chia sẻ
                  </button>
                </div>

                <div className="course-card__includes">
                  <h4>Khóa học bao gồm:</h4>
                  <ul>
                    <li>
                      <Video size={18} /> {formatDuration(course.duration)}{" "}
                      video
                    </li>
                    <li>
                      <FileText size={18} /> Tài liệu học tập
                    </li>
                    <li>
                      <Code size={18} /> Bài tập thực hành
                    </li>
                    <li>
                      <Award size={18} /> Chứng chỉ hoàn thành
                    </li>
                    <li>
                      <Clock size={18} /> Truy cập trọn đời
                    </li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseDetailPage;
