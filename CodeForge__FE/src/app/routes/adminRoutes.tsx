import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router";
import AdminLayout from "@/layouts/admin/AdminLayout";

// ✅ Lazy import các page
const Dashboard = lazy(() => import("@/pages/admin/Dashboard/Dashboard"));
const Users = lazy(() => import("@/pages/admin/Users/UsersManagement"));
const Assignments = lazy(() => import("@/pages/admin/ExercisesManagement/ExercisesManagement"));
const Submissions = lazy(() => import("@/pages/admin/SubmissionsManagement/SubmissionsManagement"));
const Settings = lazy(() => import("@/pages/admin/CoursesManagement/CoursesManagement"));

// ✅ Route config
export const adminRoutes: RouteObject = {
  path: "/admin",
  element: (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminLayout />
    </Suspense>
  ),
  children: [
    {
      index: true,
      element: (
        <Suspense fallback={<div>Loading Dashboard...</div>}>
          <Dashboard />
        </Suspense>
      ),
    },
    {
      path: "dashboard",
      element: (
        <Suspense fallback={<div>Loading Dashboard...</div>}>
          <Dashboard />
        </Suspense>
      ),
    },
    {
      path: "users",
      element: (
        <Suspense fallback={<div>Loading Users...</div>}>
          <Users />
        </Suspense>
      ),
    },
    {
      path: "assignments",
      element: (
        <Suspense fallback={<div>Loading Assignments...</div>}>
          <Assignments />
        </Suspense>
      ),
    },
    {
      path: "submissions",
      element: (
        <Suspense fallback={<div>Loading Submissions...</div>}>
          <Submissions />
        </Suspense>
      ),
    },
    {
      path: "Courses",
      element: (
        <Suspense fallback={<div>Loading Courses...</div>}>
          <Settings />
        </Suspense>
      ),
    },
  ],
};
