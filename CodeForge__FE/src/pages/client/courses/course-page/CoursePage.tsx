import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import limit from "@/common/const/const";
import banner from "@/assets/img/banner.png";
import "./CoursePage.scss";
import {
  CourseFilters,
  CourseList,
  useCourses,
  type Course,
  type CourseLevel,
} from "@/features";
import { calculateDiscount, formatPrice } from "@/features";

// ======================
// 📘 Component
// ======================
const CoursePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = Number(searchParams.get("page")) || 1;
  const searchParam = searchParams.get("search") || "";
  const levelParam = searchParams.get("level") || "all";
  const [page, setPage] = useState(pageParam);
  const [level, setLevel] = useState(levelParam);
  const [searchTerm, setSearchTerm] = useState(searchParam);

  // ======================
  // 🚀 Fetch Courses (React Query)
  // ======================
  const { data, isLoading, isError } = useCourses(
    page,
    limit,
    searchTerm,
    level
  );
  useEffect(() => {
    const params: Record<string, string> = {};
    if (page > 1) params.page = String(page);
    if (searchTerm.trim() !== "") params.search = searchTerm;
    setSearchParams(params);
  }, [page, searchTerm, setSearchParams]);

  const courses: Course[] = data?.data || [];
  const totalItems = data?.totalItems || 0;

  // ======================
  // 💡 UI
  // ======================
  return (
    <div className="course-page">
      {/* Banner */}
      <div className="course-page__banner">
        <img src={banner} alt="Banner" />
      </div>

      <div className="course-page__container">
        <CourseFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setPage={setPage}
          setLevel={setLevel}
        />

        {/* Course Grid */}
        <CourseList
          page={page}
          limit={limit}
          setPage={setPage}
          totalItems={totalItems}
          isLoading={isLoading}
          isError={isError}
          courses={courses}
          formatPrice={formatPrice}
          calculateDiscount={calculateDiscount}
        />
      </div>
    </div>
  );
};

export default CoursePage;
