import {
  PaymentProcessing,
  PaymentResult,
  PaymentReturn,
} from "@/features/payment";
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
    // { path: "practice/:slug", element: <PracticeDetailPage /> },
    { path: "payment-return", element: <PaymentReturn /> },
    { path: "payment-processing", element: <PaymentProcessing /> },
    { path: "payment-result", element: <PaymentResult /> },
  ],
};
