import React from "react";
import type { Course } from "@/features/dashboard/types";
import "./styles/TopCoursesCard.scss";

interface TopCoursesCardProps {
  courses: Course[];
  isLoading?: boolean;
}

/**
 * Component hiển thị danh sách khóa học phổ biến
 * Hiển thị tiến độ hoàn thành với progress bar
 */
export const TopCoursesCard: React.FC<TopCoursesCardProps> = ({
  courses,
  isLoading,
}) => {
  if (isLoading) {
    return <div className="top-courses__loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="top-courses">
      <h4 className="top-courses__title">Khóa học phổ biến</h4>
      <div className="top-courses__list">
        {courses.map((course, idx) => (
          <div key={idx} className="top-courses__item">
            <div className="top-courses__row">
              <p className="top-courses__name">{course.name}</p>
              <span className="top-courses__count">{course.students}</span>
            </div>
            <div className="top-courses__progress-bar">
              <div
                className="top-courses__progress"
                style={{ width: `${course.completion}%` }}
              />
            </div>
            <p className="top-courses__percent">{course.completion}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCoursesCard;
