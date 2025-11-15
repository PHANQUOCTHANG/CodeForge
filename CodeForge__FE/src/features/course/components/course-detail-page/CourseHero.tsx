import React from "react";
import { Progress, Rate } from "antd";
import {
  Award,
  BookOpen,
  Clock,
  Code,
  FileText,
  HelpCircle,
  Play,
  Users,
  Video,
} from "lucide-react";
import {
  formatDuration,
  formatPrice,
} from "@/features/course/utils/courseUtils";
import type { CourseDetail } from "@/features/course/types";
import { useNavigate } from "react-router-dom";
import { PaymentButton } from "@/features/payment";

interface Props {
  course: CourseDetail;
  finalPrice: number;
}
type LessonTypeInfo = {
  icon: React.ReactNode;
  label: string;
};

export const CourseHero: React.FC<Props> = ({ course, finalPrice }) => {
  const navigate = useNavigate();
  // Map các loại lesson type với icon và label tương ứng
  const lessonTypeMap: Record<string, LessonTypeInfo> = {
    video: {
      icon: <Video size={18} />,
      label: "Bài giảng video",
    },
    text: {
      icon: <FileText size={18} />,
      label: "Bài đọc",
    },
    coding: {
      icon: <Code size={18} />,
      label: "Bài tập lập trình",
    },
    quiz: {
      icon: <HelpCircle size={18} />,
      label: "Bài kiểm tra",
    },
  };

  // Hàm lấy set các lesson type
  const getLessonTypes = (): Set<string> => {
    const types = new Set<string>();
    course.modules.forEach((module) => {
      module.lessons.forEach((lesson) => {
        if (lesson.lessonType) {
          types.add(lesson.lessonType);
        }
      });
    });
    return types;
  };

  // Đếm số lượng mỗi loại lesson
  const getLessonTypeCounts = (): Record<string, number> => {
    const counts: Record<string, number> = {};
    course.modules.forEach((module) => {
      module.lessons.forEach((lesson) => {
        if (lesson.lessonType) {
          counts[lesson.lessonType] = (counts[lesson.lessonType] || 0) + 1;
        }
      });
    });
    return counts;
  };

  const lessonTypes = getLessonTypes();
  const lessonCounts = getLessonTypeCounts();

  // Find first uncompleted lesson
  const findFirstUncompletedLesson = () => {
    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        if (!lesson.isCompleted) {
          return {
            moduleId: module.moduleId,
            lessonId: lesson.lessonId,
          };
        }
      }
    }
    // If all completed, return first lesson
    return course.modules[0]?.lessons[0]
      ? {
          moduleId: course.modules[0].moduleId,
          lessonId: course.modules[0].lessons[0].lessonId,
        }
      : null;
  };

  // Handle continue learning
  const handleContinueLearning = () => {
    const nextLesson = findFirstUncompletedLesson();
    if (nextLesson) {
      navigate(
        `/courses/${course.slug}/learn/${nextLesson.moduleId}/${nextLesson.lessonId}`
      );
    }
  };

  return (
    <section className="course-hero">
      {" "}
      <div className="course-hero__container">
        {" "}
        <div className="course-hero__content">
          {" "}
          <h1 className="course-hero__title">{course.title}</h1>{" "}
          <p className="course-hero__description"> {course.description} </p>{" "}
          <div className="course-hero__meta">
            {" "}
            <div className="course-hero__rating">
              {" "}
              <span className="rating-value">{course.rating}</span>{" "}
              <Rate disabled defaultValue={course.rating} />{" "}
              <span className="rating-count">
                {" "}
                ({course.totalRatings} đánh giá){" "}
              </span>{" "}
            </div>{" "}
            <div className="course-hero__students">
              {" "}
              <Users size={18} />{" "}
              <span> {course.totalStudents.toLocaleString()} học viên </span>{" "}
            </div>{" "}
            <div className="course-hero__level">
              {" "}
              <Award size={18} />{" "}
              <span>
                {" "}
                {course.level === "beginner"
                  ? "Cơ bản"
                  : course.level === "intermediate"
                  ? "Trung cấp"
                  : "Nâng cao"}{" "}
              </span>{" "}
            </div>{" "}
            <div className="course-hero__duration">
              {" "}
              <Clock size={18} /> <span>{formatDuration(course.duration)}</span>{" "}
            </div>{" "}
          </div>{" "}
          <div className="course-hero__instructor">
            {" "}
            <img alt={course.author} />{" "}
            <div>
              {" "}
              <span className="instructor-label">Giảng viên</span>{" "}
              <span className="instructor-name">{course.author}</span>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <div className="course-hero__thumbnail">
          {" "}
          <img src={course.thumbnail} alt={course.title} />{" "}
        </div>{" "}
        <div className="course-card">
          {course.isEnrolled ? (
            <div className="course-card__price">Đã đăng ký</div>
          ) : (
            <div className="course-card__price">
              {course.price <= 0 && <span>Miễn phí</span>}
              {course.price > 0 && (
                <>
                  {course.discount <= 0 ? (
                    <span className="final-price">
                      {formatPrice(finalPrice)}
                    </span>
                  ) : (
                    <>
                      <span className="original-price">
                        {formatPrice(course.price)}
                      </span>
                      <span className="discount-badge">
                        -{course.discount}%
                      </span>
                      <span className="final-price">
                        {formatPrice(finalPrice)}
                      </span>
                    </>
                  )}
                </>
              )}
            </div>
          )}
          {!course.isEnrolled ? (
            <div className="course-card__actions">
              {course.price === 0 ? (
                <PaymentButton
                  courseId={course.courseId}
                  title="Đăng ký miễn phí"
                  method="free"
                />
              ) : (
                <PaymentButton
                  courseId={course.courseId}
                  title="Mua"
                  method="payment"
                />
              )}
            </div>
          ) : (
            <div className="course-card__actions">
              <button
                className="btn-continue"
                onClick={handleContinueLearning}
                aria-label="Tiếp tục học khóa học"
              >
                <Play size={20} />
                <span>Tiếp tục học</span>
              </button>
            </div>
          )}
          <div className="course-card__includes">
            <h4>Khóa học bao gồm:</h4>{" "}
            <ul>
              {/* Hiển thị các loại bài học có trong khóa học */}
              {Array.from(lessonTypes).map((type) => (
                <li key={type}>
                  {lessonTypeMap[type]?.icon || <BookOpen size={18} />}
                  <span>
                    {lessonCounts[type]}{" "}
                    {lessonTypeMap[type]?.label || "Bài học"}
                  </span>
                </li>
              ))}

              {/* Các thông tin bổ sung */}
              <li>
                <Clock size={18} />
                <span>{formatDuration(course.duration)} tổng thời lượng</span>
              </li>
              <li>
                <Award size={18} />
                <span>Chứng chỉ hoàn thành</span>
              </li>
              <li>
                <Clock size={18} />
                <span>Truy cập trọn đời</span>
              </li>
            </ul>
          </div>{" "}
        </div>{" "}
        {course.isEnrolled && (
          <div className="course-hero__progress">
            <Progress
              percent={course.progress}
              status="active"
              format={(percent) => (
                <span style={{ color: "#fff" }}>{percent}%</span>
              )}
            />
          </div>
        )}
      </div>{" "}
    </section>
  );
};
export default CourseHero;
