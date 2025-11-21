import { lazy } from "react";
export const CourseManagementPage = lazy(
  () => import("./courses-management/course-management-page/CoursesManagement")
);
export const Dashboard = lazy(() => import("./dashboard/Dashboard"));
export const ExerciesManagement = lazy(
  () => import("./exercises-management/ExercisesManagement")
);
export const SubmissionsManagement = lazy(
  () => import("./submissions-Management/SubmissionsManagement")
);
export const UsersManagement = lazy(
  () => import("./users-management/UsersManagement")
);
