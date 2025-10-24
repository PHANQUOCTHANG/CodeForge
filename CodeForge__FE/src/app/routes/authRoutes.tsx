import { AuthLayout } from "@/layouts";
import { LoginPage, RegisterPage, Logout } from "@/pages";
import ForgotPasswordPage from "@/pages/auth/forget-password/ForgetPasswordPage";
export const authRouters = {
  path: "/",
  element: <AuthLayout />,
  children: [
    {
      path: "login",
      element: <LoginPage />,
    },
    { path: "register", element: <RegisterPage /> },
    { path: "log-out", element: <Logout /> },
    { path: "forgot-password", element: <ForgotPasswordPage /> },
  ],
};
