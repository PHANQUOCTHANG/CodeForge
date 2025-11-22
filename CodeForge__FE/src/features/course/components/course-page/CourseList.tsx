import React from "react";
import { Skeleton, Empty, Pagination } from "antd";
import type { Course } from "@/features/course/types";
import CourseCard from "@/features/course/components/course-page/CourseCard";

interface Props {
  isLoading: boolean;
  isError: boolean;
  courses: Course[];
  totalItems: number;
  limit: number;
  page: number;
  setPage: (v: number) => void;
  formatPrice: (price?: number) => string;
  calculateDiscount: (price?: number, discount?: number) => number;
}

const CourseList: React.FC<Props> = ({
  isLoading,
  isError,
  courses,
  totalItems,
  limit,
  page,
  setPage,
  formatPrice,
  calculateDiscount,
}) => {
  return (
    <>
      {isLoading ? (
        <div className="course-page__grid">
          {Array.from({ length: limit }).map((_, idx) => (
            <div key={idx} className="course-card">
              {/* Thumbnail */}
              <div className="course-card__thumbnail">
                <Skeleton.Avatar active shape="square" size={160} />
                <span className="course-card__fire-icon">🔥</span>
              </div>

              <div className="course-card__content">
                {/* Badge */}
                <Skeleton.Input
                  active
                  style={{ width: 60, height: 20, marginBottom: 8 }}
                />

                {/* Title */}
                <Skeleton.Input
                  active
                  style={{ width: "80%", height: 20, marginBottom: 8 }}
                />

                {/* Instructor */}
                <Skeleton.Input
                  active
                  style={{ width: "50%", height: 16, marginBottom: 8 }}
                />

                {/* Rating */}
                <Skeleton
                  active
                  paragraph={false}
                  title={false}
                  style={{ width: 100, marginBottom: 8 }}
                />

                {/* Price */}
                <div style={{ display: "flex", gap: 8 }}>
                  <Skeleton.Input active style={{ width: 80, height: 20 }} />
                  <Skeleton.Input active style={{ width: 60, height: 20 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <Empty description="Lỗi khi tải dữ liệu" />
      ) : courses.length === 0 ? (
        <Empty description="Không có khóa học nào" />
      ) : (
        <>
          <div className="course-page__grid">
            {courses.map((course) => {
              return (
                <CourseCard
                  key={course.courseID ?? course.courseID ?? course.slug}
                  calculateDiscount={calculateDiscount}
                  formatPrice={formatPrice}
                  course={course}
                />
              );
            })}
          </div>

          <div className="pagination-wrapper">
            <Pagination
              align="center"
              current={page}
              total={totalItems}
              pageSize={limit}
              onChange={(newPage) => setPage(newPage)}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </>
  );
};

export default CourseList;
