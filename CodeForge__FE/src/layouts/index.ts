import { lazy } from "react";
export const AdminLayout = lazy(() => import("./admin/AdminLayout"));
export const ClientLayout = lazy(() => import("./client/ClientLayout"));
export const AuthLayout = lazy(() => import("./auth/AuthLayout"));
export const RootLayout = lazy(() => import("./root/RootLayout"));
export const CourseLayout = lazy(() => import("./course/CourseLayout"));
export const CodingLayout = lazy(() => import("./coding/CodingLayout"));
