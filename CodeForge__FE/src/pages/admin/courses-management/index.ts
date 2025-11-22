import { lazy } from "react";
export const CourseManagementPage = lazy(
  () => import("./course-management-page/CoursesManagement")
);
