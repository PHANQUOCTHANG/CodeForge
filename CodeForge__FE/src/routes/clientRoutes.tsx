import { useRoutes } from "react-router-dom";
import HomePage from "../pages/client/Home/HomePage";
import DefaultLayout from "../layouts/client/defaultLayout";
import PracticePage from "../pages/client/Practice/PracticePage";
import NotFoundPage from "../pages/NotFound/NotFound";
import LoginPage from "@/pages/client/Login/LoginPage";
import RegisterPage from "@/pages/client/Register/RegisterPage";
import ForgotPasswordPage from "@/pages/client/ForgetPassword/ForgetPasswordPage";
import PracticeRoutes from "./practiceRoutes";

const ClientRouters = () => {
  const routers = useRoutes([
    {
      path: "/",
      element: <DefaultLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "courses", element: <HomePage /> },
        { path: "practice", element: <PracticePage /> },
        { path: "contact", element: <HomePage /> },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPasswordPage />,
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
    ...PracticeRoutes ,
  ]);

  return routers;
};

export default ClientRouters;
