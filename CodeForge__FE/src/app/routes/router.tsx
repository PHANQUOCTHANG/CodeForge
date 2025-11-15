// src/app/router.tsx
import { createBrowserRouter } from "react-router-dom";
import { authRouters } from "./authRoutes";
import { clientRouters } from "./clientRoutes";
import { lazy } from "react";
import RootLayout from "@/layouts/root/RootLayout";
import { courseRouters } from "./courseRoutes";
import { practiceRouters } from "./practiceRoutes";
import { adminRouters } from "./adminRoutes";
<<<<<<< HEAD
import { adminProblemRoutes } from "./adminProblemRoutes";
=======
>>>>>>> 4267c93ffa34cc360cdb6298ed97d499bdd02553
const NotFound = lazy(() => import("@/pages/not-found/NotFound"));

export const router = createBrowserRouter([
  {
    path: "/",
<<<<<<< HEAD
    element: <RootLayout />,
=======
    element: <RootLayout />, // ✅ Đây là chỗ App.tsx được render
>>>>>>> 4267c93ffa34cc360cdb6298ed97d499bdd02553
    children: [
      clientRouters,
      adminRouters,
      authRouters,
      courseRouters,
      practiceRouters,
<<<<<<< HEAD
      ...adminProblemRoutes,
=======
>>>>>>> 4267c93ffa34cc360cdb6298ed97d499bdd02553
    ],
    errorElement: <NotFound />,
  },
]);
