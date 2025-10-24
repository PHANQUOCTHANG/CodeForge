import { lazy } from "react";
import { CoursePage, CourseDetailPage, CourseLearningPage } from "./courses";
import { PracticePage, PracticeDetailPage } from "./practice";
export const HomePage = lazy(() => import("./home/HomePage"));
export { CoursePage, CourseDetailPage, CourseLearningPage };
export { PracticePage, PracticeDetailPage };
