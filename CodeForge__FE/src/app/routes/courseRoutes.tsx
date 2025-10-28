import { CourseLayout } from "@/layouts";
import { CourseLearningPage } from "@/pages";

export const courseRouters = {
  path: "/courses/:slug/learn/:moduleId/:lessonId",
  element: <CourseLayout />,
  children: [{ index: true, element: <CourseLearningPage /> }],
};
