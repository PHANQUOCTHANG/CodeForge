import { ClientLayout } from "@/layouts";
import {
  HomePage,
  CoursePage,
  CourseDetailPage,
  PracticePage,
  PracticeDetailPage,
} from "@/pages";
export const clientRouters = {
  path: "/",
  element: <ClientLayout />,
  children: [
    { index: true, element: <HomePage /> },
    {
      path: "courses",
      element: <CoursePage />,
    },
    { path: "courses/:slug", element: <CourseDetailPage /> },
    { path: "practice", element: <PracticePage /> },
    { path: "practice/:slug", element: <PracticeDetailPage /> },
  ],
};
