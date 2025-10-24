// Public API cho toàn bộ feature auth

// 🟢 Xuất public components
export { default as CourseCard } from "./components/course-page/CourseCard";
export { default as CourseFilters } from "./components/course-page/CourseFilters";
export { default as CourseList } from "./components/course-page/CourseList";
export { default as CourseHero } from "./components/course-detail-page/CourseHero";
export { default as CourseCurriculum } from "./components//course-detail-page/CourseCurriculum";
export { default as CourseReviews } from "./components/course-detail-page/CourseReviews";
export { default as CourseSidebar } from "./components/course-detail-page/CourseSidebar";

// 🧠 Xuất hooks chính
export * from "./hooks/useCourses";
export * from "./hooks/useCourseDetail";

// 🪄 Xuất services / slice nếu cần dùng global
export * from "./services/courseApi";

export * from "./utils/courseUtils";

// 🧩 Xuất types (nếu có dùng bên ngoài feature khác)
export * from "./types";
