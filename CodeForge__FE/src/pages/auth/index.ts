import { lazy } from "react";
export const LoginPage = lazy(() => import("./login/LoginPage"));
export const RegisterPage = lazy(() => import("./register/RegisterPage"));
export const ForgetPassword = lazy(
  () => import("./forget-password/ForgetPasswordPage")
);
export const Logout = lazy(() => import("./logout/Logout"));
