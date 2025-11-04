import ProtectedRoute from "@/common/components/common/ProtectedRoute";
import { CourseLayout } from "@/layouts";
import { CourseLearningPage } from "@/pages";

export const courseRouters = {
  path: "/courses/:slug/learn/:moduleId/:lessonId",

  element: <ProtectedRoute requiredRole="student" />,
  children: [
    {
      path: "/courses/:slug/learn/:moduleId/:lessonId",
      element: <CourseLayout />,
      children: [{ index: true, element: <CourseLearningPage /> }],
    },
  ],
};
