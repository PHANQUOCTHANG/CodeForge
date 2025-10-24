import { RegisterForm, useRegister } from "@/features";
import "./RegisterPage.scss";
export default function RegisterPage() {
  const { mutate, isPending } = useRegister();
  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-title">Đăng ký tài khoản</h2>
        <RegisterForm onSubmit={mutate} loading={isPending} />
      </div>
    </div>
  );
}
