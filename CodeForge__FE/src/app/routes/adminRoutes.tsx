// adminRouters.ts (Cách làm sạch sẽ hơn)

import type { RouteObject } from "react-router";
import AdminLayout from "@/layouts/admin/AdminLayout";
import {
  CourseManagementPage,
  Dashboard,
  SubmissionsManagement,
  UsersManagement,
} from "@/pages";
import ProblemManagement from "@/pages/admin/problem/page-problem/PageProblem";
import CreateCourseEditor from "@/pages/admin/courses-management/components/new-model/NewCourse";
import EditCourseEditor from "@/pages/admin/courses-management/components/course-edit/CourseEditorEnhanced";
import CategoryManagement from "@/pages/admin/categories-management/CategoryManagement";

export const adminRouters: RouteObject = {
  path: "/admin",
  // 1. Áp dụng Bảo vệ và yêu cầu quyền 'admin'
  element: <ProtectedRoute requiredRole="admin" />,

  children: [
    {
      // 2. Định nghĩa Layout
      // Mọi route con sẽ render bên trong AdminLayout
      element: <AdminLayout />,
      children: [
        {
          index: true,
          element: <Dashboard />, // -> Khớp với /admin
        },
        {
          path: "dashboard",
          element: <Dashboard />, // -> Khớp với /admin/dashboard
        },
        {
          path: "users",
          element: <UsersManagement />, // -> Khớp với /admin/users
        },
        // ... (các route con khác tương tự)
        {
          path: "submissions",
          element: <SubmissionsManagement />,
        },
        {
          path: "courses-category",
          element: <CategoryManagement />,
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
              element: <CreateCourseEditor />,
            },
            {
              path: "edit/:courseId",
              element: <EditCourseEditor />,
            },
          ],
        },

        { path: "problems", element: <ProblemManagement></ProblemManagement> },
      ],
    },
  ],
};
