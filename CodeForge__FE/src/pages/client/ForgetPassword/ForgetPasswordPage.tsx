import React from "react";
import { Form, Input, Button, message } from "antd";
import { useForm, Controller } from "react-hook-form";
import "./ForgetPasswordPage.scss";
import { Link } from "react-router-dom";

interface ForgotPasswordForm {
  email: string;
}

const ForgotPasswordPage: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    message.success(`Yêu cầu đặt lại mật khẩu đã gửi tới ${data.email}`);
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <h2 className="forgot-title">Quên mật khẩu</h2>
        <p className="forgot-subtitle">
          Nhập địa chỉ email của bạn để nhận liên kết đặt lại mật khẩu.
        </p>

        <Form
          layout="vertical"
          onFinish={handleSubmit(onSubmit)}
          className="forgot-form"
        >
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
              render={({ field }) => (
                <Input {...field} placeholder="Nhập email của bạn" />
              )}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isSubmitting}
            className="btn-forgot"
          >
            Gửi yêu cầu
          </Button>
        </Form>

        <div className="forgot-footer">
          <p>
            Nhớ lại mật khẩu? <Link to="/login">Đăng nhập</Link>
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

export default ForgotPasswordPage;
