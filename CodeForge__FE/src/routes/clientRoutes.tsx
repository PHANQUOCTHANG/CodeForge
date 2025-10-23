import { useRoutes } from "react-router-dom";
import HomePage from "../pages/client/Home/HomePage";
import DefaultLayout from "../layouts/client/defaultLayout";
import PracticePage from "../pages/client/Practice/PracticePage";
import NotFoundPage from "../pages/NotFound/NotFound";
import LoginPage from "@/pages/client/Login/LoginPage";
import RegisterPage from "@/pages/client/Register/RegisterPage";
import ForgotPasswordPage from "@/pages/client/ForgetPassword/ForgetPasswordPage";
import {
  CoursePage,
  CoursePageDetail,
  StudyCoursePage,
} from "@/pages/client/Courses";
import Logout from "@/pages/client/Logout/Logout";

const ClientRouters = () => {
  const routers = useRoutes([
    {
      path: "/",
      element: <DefaultLayout />,
      children: [
        { index: true, element: <HomePage /> },
        {
          path: "courses",
          element: <CoursePage />,
        },
        { path: "courses/:slug", element: <CoursePageDetail /> },
        { path: "practice", element: <PracticePage /> },
        { path: "contact", element: <StudyCoursePage /> },
      ],
    },
    { path: "courses/:slug/lesson/:id", element: <CoursePageDetail /> },

    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/log-out",
      element: <Logout />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPasswordPage />,
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);

  return routers;
};

export default ClientRouters;
