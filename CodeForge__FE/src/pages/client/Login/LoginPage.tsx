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
  password: string;
}

const LoginPage: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    console.log(data);
    const res = await authApi.login(data.email, data.password);
    console.log(res);
    message.success(`Đăng nhập thành công: ${data.email}`);
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
            validateStatus={errors.password ? "error" : ""}
            help={errors.password?.message}
          >
            <Controller
              name="password"
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
