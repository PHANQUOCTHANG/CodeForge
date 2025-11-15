import React from "react";
import { Rate, Popover, Progress } from "antd";
import { useNavigate } from "react-router-dom";
import type { Course } from "@/features/course/types";
import { Play } from "lucide-react";

interface Props {
  course: Course;
  formatPrice: (price?: number) => string;
  calculateDiscount: (price?: number, discount?: number) => number;
}
const CourseCard: React.FC<Props> = ({
  course,
  formatPrice,
  calculateDiscount,
}) => {
  const navigate = useNavigate();

  const title = <span className="course-page__popup--title">Khóa học</span>;

  const content = (
    <div style={{ width: 320 }} className="course-page__popup">
      <h3>{course.title}</h3>
      <ul>
        <li>{course.duration} giờ</li>
        <li>{course.lessonCount} Bài học</li>
        <li>{course.totalStudents} học viên</li>
      </ul>
      <div dangerouslySetInnerHTML={{ __html: course.description! }} />
      <div className="course-page__popup--action" style={{ marginTop: 10 }}>
        {!course.isEnrolled ? (
          <>
            {course.price == 0 && (
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/courses/${course.slug}`)}
              >
                Đăng ký miễn phí
              </button>
            )}
            {course.price != 0 && (
              <button
                onClick={() => navigate(`/courses/${course.slug}`)}
                className="btn-buy-now"
              >
                Mua ngay
              </button>
            )}
          </>
        ) : (
          <button
            className="btn-continue"
            onClick={() => navigate(`/courses/${course.slug}`)}
          >
            <Play size={20} />
            Tiếp tục học
          </button>
        )}
      </div>
    </div>
  );

  return (
    <Popover placement="left" content={content} title={title} trigger="hover">
      <div
        onClick={() => navigate(`/courses/${course.slug}`)}
        className="course-card"
      >
        <div className="course-card__thumbnail">
          <img src={course.thumbnail} alt={course.title} />
          <span className="course-card__fire-icon">🔥</span>
        </div>

        <div className="course-card__content">
          <div className="course-card__category">
            {course.badge || "Khóa học"}
          </div>
          <h3 className="course-card__title">{course.title}</h3>
          <div className="course-card__instructor">{course.author}</div>

          <div className="course-card__rating">
            <Rate allowHalf disabled defaultValue={course.rating} />
            <span className="course-card__rating-value">
              {course.rating || 0}
            </span>
          </div>

          <div className="course-card__footer">
            <div className="course-card__price-section">
              {course.isEnrolled ? (
                <div className="course-card__price">Đã đăng ký</div>
              ) : (
                <>
                  <div className="course-card__price">
                    {course.price <= 0
                      ? "Miễn phí"
                      : formatPrice(
                          calculateDiscount(course.price, course.discount)
                        )}
                  </div>
                  {course.discount > 0 && (
                    <div>
                      <span className="course-card__original-price">
                        {formatPrice(course.price)}
                      </span>
                      <span className="course-card__discount">
                        -{course.discount}%
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          {course.isEnrolled && (
            <Progress percent={course.progress} status="active" />
          )}
        </div>
      </div>
    </Popover>
  );
};

export default CourseCard;
