import { lazy } from "react";
export const CourseManagementPage = lazy(
  () => import("./courses-management/CoursesManagement")
);
export const CourseEditorPage = lazy(
  () => import("./courses-management/CourseEditorEnhanced")
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
