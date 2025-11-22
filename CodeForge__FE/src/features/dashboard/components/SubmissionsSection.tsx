import React from "react";
import { TopCoursesCard } from "./TopCoursesCard";
import "./styles/SubmissionsSection.scss";

interface SubmissionsSectionProps {
  topCourses: any[];
  isLoading?: boolean;
}

/**
 * Component hiển thị khóa học phổ biến
 * Đơn giản hóa để chỉ hiển thị top courses
 */
export const SubmissionsSection: React.FC<SubmissionsSectionProps> = ({
  topCourses,
  isLoading,
}) => {
  return (
    <div className="submissions-section">
      <TopCoursesCard courses={topCourses} isLoading={isLoading} />
    </div>
  );
};

export default SubmissionsSection;
