import type { RouteObject } from "react-router";
import AdminLayout from "@/layouts/admin/AdminLayout";
import {
  CourseManagementPage,
  CourseEditorPage,
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
      path: "courses",
      children: [
        {
          index: true,
          element: <CourseManagementPage />,
        },
        {
          path: "new",
          element: <CourseEditorPage />,
        },
        {
          path: ":id/edit",
          element: <CourseEditorPage />,
        },
      ],
    },
  ],
};
