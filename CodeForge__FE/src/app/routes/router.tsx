// src/app/router.tsx
import { createBrowserRouter } from "react-router-dom";
import { authRouters } from "./authRoutes";
import { clientRouters } from "./clientRoutes";
import { adminRoutes } from "./adminRoutes";
import { lazy } from "react";
import RootLayout from "@/layouts/root/RootLayout";
import { courseRouters } from "./courseRoutes";
import { practiceRouters } from "./practiceRoutes";
const NotFound = lazy(() => import("@/pages/not-found/NotFound"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, // ✅ Đây là chỗ App.tsx được render
    children: [clientRouters, adminRouters, authRouters, courseRouters , practiceRouters],
    errorElement: <NotFound />,
  },
]);
