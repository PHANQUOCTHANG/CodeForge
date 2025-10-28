// features/auth/components/register-form/RegisterForm.tsx
import React from "react";
import { Form, Input, Button } from "antd";
import { Controller, useForm } from "react-hook-form";

export interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormProps {
  onSubmit: (data: RegisterFormValues) => Promise<void>;
  loading?: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  loading,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      <Form.Item label="Tên tài khoản" help={errors.username?.message}>
        <Controller
          name="username"
          control={control}
          rules={{ required: "Vui lòng nhập tên tài khoản" }}
          render={({ field }) => (
            <Input {...field} placeholder="Tên tài khoản" />
          )}
        />
      </Form.Item>

      <Form.Item label="Email" help={errors.email?.message}>
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Vui lòng nhập email",
            pattern: { value: /^\S+@\S+$/i, message: "Email không hợp lệ" },
          }}
          render={({ field }) => <Input {...field} placeholder="Email" />}
        />
      </Form.Item>

      <Form.Item label="Mật khẩu" help={errors.password?.message}>
        <Controller
          name="password"
          control={control}
          rules={{ required: "Vui lòng nhập mật khẩu" }}
          render={({ field }) => (
            <Input.Password {...field} placeholder="Mật khẩu" />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Xác nhận mật khẩu"
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

      <Button type="primary" htmlType="submit" block loading={loading}>
        Đăng ký
      </Button>
    </Form>
  );
};
export default RegisterForm;
