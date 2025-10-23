import React from "react";
import { Form, Input, Button, Divider } from "antd";
import {
  GoogleOutlined,
  GithubOutlined,
  WindowsOutlined,
} from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import "./RegisterPage.scss";
import authApi from "@/api/authApi";
import { openNotification } from "@/helper/notification";
import { setGlobalAccessToken, setGlobalDispatch } from "@/api/axios";
import { login } from "@/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/store";

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

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const onSubmit = async (data: RegisterFormValues) => {
    const { username, email, password } = data;
    try {
      // 🔹 1. Gọi API đăng ký
      const response = await authApi.register(username, email, password);
      openNotification("success", "Thành công", "Đăng ký thành công!");
      if (response.isSuccess) {
        setTimeout(() => {
          const { accessToken, userInfo } = response.data;
          setGlobalAccessToken(accessToken);
          setGlobalDispatch(dispatch);
          dispatch(login({ accessToken: accessToken, userInfor: userInfo }));

          openNotification(
            "success",
            "Thành công",
            "Tự động đăng nhập thành công!"
          );

          // ✅ 6. Chuyển hướng đến trang chủ
          navigate("/");
        }, 1200);
      }

      // ✅ 5. Thông báo thành công
    } catch (error: any) {
      console.error(
        "❌ Register failed:",
        error.response?.data || error.message
      );
      openNotification(
        "error",
        "Thất bại",
        error.response?.data?.message || "Đăng ký thất bại!"
      );
    }
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
              rules={{
                required: "Vui lòng nhập tên tài khoản",
                validate: (value) =>
                  value.trim() !== "" ||
                  "Tên tài khoản không được toàn khoảng trắng",
                minLength: {
                  value: 6,
                  message: "Tên tài khoản phải có ít nhất 6 ký tự",
                },
              }}
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
                validate: (value) =>
                  value.trim() !== "" || "Email không được toàn khoảng trắng",
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
                validate: (value) =>
                  value.trim() !== "" ||
                  "Mật khẩu không được toàn khoảng trắng",
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
