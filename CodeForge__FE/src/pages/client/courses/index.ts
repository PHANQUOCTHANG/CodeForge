import { lazy } from "react";
export const CoursePage = lazy(() => import("./course-page/CoursePage"));
export const CourseDetailPage = lazy(
  () => import("./course-detail-page/CourseDetailPage")
);
export const CourseLearningPage = lazy(
  () => import("./course-learning/CourseLearningPage")
);
