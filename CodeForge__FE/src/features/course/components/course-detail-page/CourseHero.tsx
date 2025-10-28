import React from "react";
import { Rate } from "antd";
import { Award, Clock, Code, FileText, Play, Users, Video } from "lucide-react";
import {
  formatDuration,
  formatPrice,
} from "@/features/course/utils/courseUtils";
import type { Course } from "@/features/course/types";

interface Props {
  course: Course;
  finalPrice: number;
  isEnrolled: boolean;
}

export const CourseHero: React.FC<Props> = ({
  course,
  finalPrice,
  isEnrolled,
}) => {
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
          {" "}
          <div className="course-card__price">
            {" "}
            <div>
              {" "}
              <span className="final-price">
                {" "}
                {formatPrice(finalPrice)}{" "}
              </span>{" "}
            </div>{" "}
            {course.discount > 0 && (
              <>
                {" "}
                <div>
                  {" "}
                  <span className="original-price">
                    {" "}
                    {formatPrice(course.price)}{" "}
                  </span>{" "}
                  <span className="discount-badge"> -{course.discount}% </span>{" "}
                </div>{" "}
              </>
            )}{" "}
          </div>{" "}
          {!isEnrolled ? (
            <>
              {" "}
              {course.price == 0 && (
                <button className="btn btn-primary"> Đăng ký miễn phí </button>
              )}{" "}
              {course.price != 0 && (
                <button className="btn-buy-now">Mua ngay</button>
              )}{" "}
            </>
          ) : (
            <button className="btn-continue">
              {" "}
              <Play size={20} /> Tiếp tục học{" "}
            </button>
          )}{" "}
          <div className="course-card__includes">
            <h4>Khóa học bao gồm:</h4>{" "}
            <ul>
              <li>
                <Video size={18} /> {formatDuration(course.duration)} video{" "}
              </li>
              <li>
                <FileText size={18} /> Tài liệu học tập{" "}
              </li>
              <li>
                <Code size={18} /> Bài tập thực hành{" "}
              </li>
              <li>
                <Award size={18} /> Chứng chỉ hoàn thành{" "}
              </li>
              <li>
                <Clock size={18} /> Truy cập trọn đời{" "}
              </li>{" "}
            </ul>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  );
};
export default CourseHero;
