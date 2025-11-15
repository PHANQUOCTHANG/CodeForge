/**
 * Example Admin Routes Configuration
 *
 * Add these routes to your adminRoutes.tsx or admin routes configuration
 * to integrate CourseEditor and CoursesManagement components
 */

import React from "react";
import CoursesManagement from "@/pages/admin/courses-management/CoursesManagement";
import CourseEditor from "@/pages/admin/courses-management/CourseEditor";
import { useParams } from "react-router-dom";

// Wrapper component for CourseEditor to extract route params
const CourseEditorWrapper: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  return <CourseEditor courseId={id} />;
};

/**
 * Add these route objects to your admin routes configuration:
 *
 * Example using React Router v6:
 */

export const courseRoutes = [
  {
    path: "courses",
    children: [
      {
        index: true,
        element: <CoursesManagement />,
      },
      {
        path: "new",
        element: <CourseEditor />,
      },
      {
        path: ":id/edit",
        element: <CourseEditorWrapper />,
      },
    ],
  },
];

/**
 * Alternative: If using flat routes structure:
 */

export const courseRoutesFlat = [
  {
    path: "/admin/courses",
    element: <CoursesManagement />,
  },
  {
    path: "/admin/courses/new",
    element: <CourseEditor />,
  },
  {
    path: "/admin/courses/:id/edit",
    element: <CourseEditorWrapper />,
  },
];

/**
 * Usage in your main router configuration.
 *
 * const adminRoutes = {
 *   path: "/admin",
 *   element: <AdminLayout />,
 *   children: [
 *     ...otherRoutes,
 *     ...courseRoutes,
 *   ],
 * };
 */

/**
 * Navigation Links
 *
 * Use these links in your navigation component:
 */

export const courseNavigationLinks = [
  {
    label: "Khóa Học",
    path: "/admin/courses",
  },
  {
    label: "Tạo Khóa Học Mới",
    path: "/admin/courses/new",
  },
];

/**
 * Example usage in components.
 *
 * Navigate to course list: navigate("/admin/courses");
 * Navigate to new form: navigate("/admin/courses/new");
 * Navigate to edit: navigate(`/admin/courses/${courseId}/edit`);
 */

/**
 * Integration Checklist.
 *
 * ✓ Import components
 * ✓ Create CourseEditorWrapper if using :id parameter
 * ✓ Add routes to your admin route configuration
 * ✓ Import route configuration in main router file
 * ✓ Add navigation links in sidebar/menu
 * ✓ Test navigation between pages
 * ✓ Verify course list loads
 * ✓ Verify create form opens
 * ✓ Test module/lesson adding
 */
