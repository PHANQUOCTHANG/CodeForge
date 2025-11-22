import React from "react";
import { RegisterForm, useRegister } from "@/features";
import "./RegisterPage.scss";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Divider } from "antd";
import { useAppSelector } from "@/app/store/store";
const RegisterPage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const { secret } = useParams();
  const { mutate, isPending } = useRegister(secret);
  if (user) {
    navigate("/");
    return null;
  }
  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-title">Đăng ký tài khoản</h2>
        <RegisterForm onSubmit={mutate} loading={isPending} />
        <Divider plain>Hoặc tiếp tục với</Divider>

        <div className="login-footer">
          <p>
            Nếu bạn đã có tài khoản, vui lòng <Link to="/login">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default RegisterPage;
