import React from "react";
import { Play, Clock, FileText, Code, Award, Video } from "lucide-react";
import {
  formatDuration,
  formatPrice,
} from "@/features/course/utils/courseUtils";
import type { Course } from "@/features/course/types";

interface Props {
  course: Course;
  isEnrolled: boolean;
  finalPrice: number;
}

export const CourseSidebar: React.FC<Props> = ({
  course,
  isEnrolled,
  finalPrice,
}) => {
  return (
    <aside className={`course-sidebar `}>
      <div className="course-card">
        <div className="course-card__price">
          {course.discount > 0 && (
            <>
              <span className="original-price">
                {formatPrice(course.price)}
              </span>
              <span className="discount-badge">-{course.discount}%</span>
            </>
          )}
          <span className="final-price">{formatPrice(finalPrice)}</span>
        </div>

        {!isEnrolled ? (
          <>
            {course.price == 0 && (
              <button className="btn btn-primary">Đăng ký miễn phí</button>
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
              <Video size={18} /> {formatDuration(course.duration)} video
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
  );
};
export default CourseSidebar;
