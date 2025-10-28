import { Form, Input, Button } from "antd";
import { Controller, useForm } from "react-hook-form";

interface LoginFormValues {
  email: string;
  password: string;
}

interface Props {
  onSubmit: (data: LoginFormValues) => void;
  loading?: boolean;
}

export const LoginForm = ({ onSubmit, loading }: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      <Form.Item label="Email *" validateStatus={errors.email ? "error" : ""}>
        <Controller
          name="email"
          control={control}
          rules={{ required: "Vui lòng nhập email" }}
          render={({ field }) => <Input {...field} placeholder="Nhập email" />}
        />
      </Form.Item>

      <Form.Item
        label="Mật khẩu *"
        validateStatus={errors.password ? "error" : ""}
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

      <Button type="primary" htmlType="submit" block loading={loading}>
        Đăng nhập
      </Button>
    </Form>
  );
};
export default LoginForm;
