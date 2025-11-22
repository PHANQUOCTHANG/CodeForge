// src/app/router.tsx
import { createBrowserRouter } from "react-router-dom";
import { authRouters } from "./authRoutes";
import { clientRouters } from "./clientRoutes";
import { lazy } from "react";
import RootLayout from "@/layouts/root/RootLayout";
import { courseRouters } from "./courseRoutes";
import { practiceRouters } from "./practiceRoutes";
import { adminRouters } from "./adminRoutes";
import { adminProblemRoutes } from "./adminProblemRoutes";
const NotFound = lazy(() => import("@/pages/not-found/NotFound"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, // ✅ Đây là chỗ App.tsx được render
    children: [
      clientRouters,
      adminRouters,
      authRouters,
      courseRouters,
      practiceRouters,
      ...adminProblemRoutes,
    ],
    errorElement: <NotFound />,
  },
]);
