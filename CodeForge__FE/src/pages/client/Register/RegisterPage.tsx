import React from "react";
import { Form, Input, Button, Divider, message } from "antd";
import {
  GoogleOutlined,
  GithubOutlined,
  WindowsOutlined,
} from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import "./RegisterPage.scss";

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    message.success(`Tạo tài khoản thành công cho: ${data.username}`);
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-title">
          Đăng ký tài khoản mới cùng <span>CodeLearn</span>
        </h2>

        <Form
          layout="vertical"
          onFinish={handleSubmit(onSubmit)}
          className="register-form"
        >
          <Form.Item
            label="Tên tài khoản*"
            validateStatus={errors.username ? "error" : ""}
            help={errors.username?.message}
          >
            <Controller
              name="username"
              control={control}
              rules={{ required: "Vui lòng nhập tên tài khoản" }}
              render={({ field }) => (
                <Input {...field} placeholder="Tên tài khoản" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Email*"
            validateStatus={errors.email ? "error" : ""}
            help={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Vui lòng nhập email",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Email không hợp lệ",
                },
              }}
              render={({ field }) => <Input {...field} placeholder="Email" />}
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
              rules={{
                required: "Vui lòng nhập mật khẩu",
                minLength: {
                  value: 6,
                  message: "Mật khẩu phải có ít nhất 6 ký tự",
                },
              }}
              render={({ field }) => (
                <Input.Password {...field} placeholder="Mật khẩu" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu*"
            validateStatus={errors.confirmPassword ? "error" : ""}
            help={errors.confirmPassword?.message}
          >
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: "Vui lòng xác nhận mật khẩu",
                validate: (value) =>
                  value === watch("password") || "Mật khẩu không khớp",
              }}
              render={({ field }) => (
                <Input.Password {...field} placeholder="Nhập lại mật khẩu" />
              )}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isSubmitting}
            className="btn-register"
          >
            Đăng ký
          </Button>
        </Form>

        <Divider plain>Hoặc đăng ký bằng</Divider>

        <div className="register-social">
          <Button icon={<WindowsOutlined />} />
          <Button icon={<GoogleOutlined />} />
          <Button icon={<GithubOutlined />} />
        </div>

        <div className="register-footer">
          <p>
            Đã có tài khoản? <a href="#">Đăng nhập</a>
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

export default RegisterPage;
