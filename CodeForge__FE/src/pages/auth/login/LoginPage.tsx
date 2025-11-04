import { Divider } from "antd";
import { Link } from "react-router-dom";
import "./LoginPage.scss";
import { LoginForm, useLogin } from "@/features";

export const LoginPage = () => {
  const { mutate, isPending } = useLogin();

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">
          Học lập trình cùng với hàng triệu người với <span>CodeLearn</span>
        </h2>

        <LoginForm onSubmit={(data) => mutate(data)} loading={isPending} />

        <Divider plain>Hoặc tiếp tục với</Divider>

        <div className="login-footer">
          <p>
            Nếu bạn chưa có tài khoản, vui lòng{" "}
            <Link to="/register">Đăng ký</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
