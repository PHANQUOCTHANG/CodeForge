import type { RouteObject } from "react-router";
import AdminLayout from "@/layouts/admin/AdminLayout";
import {
  CourseManagementPage,
  Dashboard,
  SubmissionsManagement,
  UsersManagement,
} from "@/pages";

// ✅ Route config
export const adminRouters: RouteObject = {
  path: "/admin",
  element: <AdminLayout />,
  children: [
    {
      index: true,
      element: <Dashboard />,
    },
    {
      path: "dashboard",
      element: <Dashboard />,
    },
    {
      path: "users",
      element: <UsersManagement />,
    },

    {
      path: "submissions",
      element: <SubmissionsManagement />,
    },
    {
      path: "Courses",
      element: <CourseManagementPage />,
    },
  ],
};
