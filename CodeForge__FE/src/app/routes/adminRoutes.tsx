import type { RouteObject } from "react-router";
import AdminLayout from "@/layouts/admin/AdminLayout";
import {
  CourseManagementPage,
  Dashboard,
  SubmissionsManagement,
  UsersManagement,
} from "@/pages";
<<<<<<< HEAD
import ProblemManagement from "@/pages/admin/problem/page-problem/PageProblem";

=======

// ✅ Route config
>>>>>>> 4267c93ffa34cc360cdb6298ed97d499bdd02553
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
    { path: "problems", element: <ProblemManagement></ProblemManagement> },
  ],
};
