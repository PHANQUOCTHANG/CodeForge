import React from "react";
import { Form, Input, Button, Divider, message } from "antd";
import {
  GoogleOutlined,
  GithubOutlined,
  WindowsOutlined,
} from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import "./LoginPage.scss";
import { Link } from "react-router-dom";
import authApi from "@/api/authApi";

interface LoginFormValues {
  email: string;
  passwordHash: string;
}

const LoginPage: React.FC = () => {

  // Để lấy dữ liệu của form gán một khuôn có sẵn .
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: { email: "", passwordHash: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    console.log(data);
    const { email, passwordHash } = data;

    try {
      const response = await authApi.login(email , passwordHash) ;

      // Nếu server trả status 200–299 thì tự coi như thành công
      alert("✅ Login success!");
      console.log("Response:", response.data);
    } catch (error: any) {
      console.error("❌ Login failed:", error.response?.data || error.message);
      alert("Đăng nhập thất bại!");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">
          Học lập trình cùng với hàng triệu người với <span>CodeLearn</span>
        </h2>

        <Form
          layout="vertical"
          onFinish={handleSubmit(onSubmit)}
          className="login-form"
        >
          <Form.Item
            label="Email *"
            validateStatus={errors.email ? "error" : undefined}
            help={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Vui lòng nhập email",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Email không hợp lệ",
                },
              }}
              render={({ field }) => (
                <Input {...field} placeholder="Nhập email" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu*"
            validateStatus={errors.passwordHash ? "error" : ""}
            help={errors.passwordHash?.message}
          >
            <Controller
              name="passwordHash"
              control={control}
              rules={{ required: "Vui lòng nhập mật khẩu" }}
              render={({ field }) => (
                <Input.Password {...field} placeholder="Mật khẩu" />
              )}
            />
          </Form.Item>

          <div className="login-extra">
            <Link to="/forgot-password" className="login-forgot">
              Quên mật khẩu?
            </Link>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isSubmitting}
            className="btn-login"
          >
            Đăng nhập
          </Button>
        </Form>

        <Divider plain>Hoặc tiếp tục với</Divider>

        <div className="login-social">
          <Button icon={<WindowsOutlined />} />
          <Button icon={<GoogleOutlined />} />
          <Button icon={<GithubOutlined />} />
        </div>

        <div className="login-footer">
          <p>
            Nếu bạn chưa có tài khoản, vui lòng{" "}
            <Link to="/register">Đăng ký</Link>
          </p>
          <small>
            Trang này được bảo vệ bởi reCAPTCHA và áp dụng{" "}
            <a href="#">Điều khoản sử dụng</a>.
          </small>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
