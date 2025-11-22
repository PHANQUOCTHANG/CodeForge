import React, { useState, useEffect } from "react";
import type {
  UserDto,
  CreateUserDto,
  UpdateUserDto,
} from "@/features/user/types";
import {
  isValidEmail,
  isValidUsername,
  isValidPassword,
  getPasswordStrength,
  getPasswordStrengthLabel,
  getPasswordStrengthColor,
} from "@/features/user/utils/userUtils";
import "./styles/UserForm.scss";

interface UserFormProps {
  user?: UserDto | null;
  isLoading?: boolean;
  onSubmit?: (data: CreateUserDto | UpdateUserDto) => void;
  onCancel?: () => void;
}

/**
 * Component form tạo/chỉnh sửa user
 */
export const UserForm: React.FC<UserFormProps> = ({
  user,
  isLoading,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CreateUserDto | UpdateUserDto>({
    username: "",
    email: "",
    fullName: "",
    password: "",
    role: "user",
    status: "active",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  // Populate form with user data if editing
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        status: user.status,
        password: "", // Don't populate password for security
      });
    }
  }, [user]);

  // Calculate password strength when password changes
  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(getPasswordStrength(formData.password));
    } else {
      setPasswordStrength(0);
    }
  }, [formData.password]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập tên đầy đủ";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Vui lòng nhập tên người dùng";
    } else if (!isValidUsername(formData.username)) {
      newErrors.username =
        "Tên người dùng phải từ 3-20 ký tự, chứa chữ, số và dấu gạch dưới";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!user && !formData.password) {
      newErrors.password =
        "Vui lòng nhập mật khẩu (bắt buộc cho tài khoản mới)";
    } else if (formData.password && !isValidPassword(formData.password)) {
      newErrors.password =
        "Mật khẩu phải có ít nhất 8 ký tự, chứa chữ hoa, chữ thường và số";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit?.(formData);
    }
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <div className="user-form__header">
        <h2 className="user-form__title">
          {user ? "Chỉnh sửa người dùng" : "Tạo người dùng mới"}
        </h2>
      </div>

      <div className="user-form__content">
        {/* Full Name */}
        <div className="user-form__group">
          <label className="user-form__label">Tên đầy đủ *</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Nhập tên đầy đủ"
            className={`user-form__input ${
              errors.fullName ? "user-form__input--error" : ""
            }`}
            disabled={isLoading}
          />
          {errors.fullName && (
            <p className="user-form__error">{errors.fullName}</p>
          )}
        </div>

        {/* Username */}
        <div className="user-form__group">
          <label className="user-form__label">Tên người dùng *</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Nhập tên người dùng (3-20 ký tự)"
            className={`user-form__input ${
              errors.username ? "user-form__input--error" : ""
            }`}
            disabled={isLoading || !!user}
          />
          {errors.username && (
            <p className="user-form__error">{errors.username}</p>
          )}
        </div>

        {/* Email */}
        <div className="user-form__group">
          <label className="user-form__label">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Nhập email"
            className={`user-form__input ${
              errors.email ? "user-form__input--error" : ""
            }`}
            disabled={isLoading}
          />
          {errors.email && <p className="user-form__error">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="user-form__group">
          <label className="user-form__label">Mật khẩu {!user && "*"}</label>
          <div className="user-form__password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={
                user ? "Để trống nếu không muốn đổi mật khẩu" : "Nhập mật khẩu"
              }
              className={`user-form__input ${
                errors.password ? "user-form__input--error" : ""
              }`}
              disabled={isLoading}
            />
            <button
              type="button"
              className="user-form__password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? "Ẩn" : "Hiển thị"}
            </button>
          </div>
          {errors.password && (
            <p className="user-form__error">{errors.password}</p>
          )}
          {formData.password && (
            <div className="user-form__password-strength">
              <div className="user-form__strength-bar">
                <div
                  className="user-form__strength-fill"
                  style={{
                    width: `${(passwordStrength / 4) * 100}%`,
                    backgroundColor: getPasswordStrengthColor(passwordStrength),
                  }}
                />
              </div>
              <p className="user-form__strength-text">
                Độ mạnh:{" "}
                <span
                  style={{ color: getPasswordStrengthColor(passwordStrength) }}
                >
                  {getPasswordStrengthLabel(passwordStrength)}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Role */}
        <div className="user-form__group">
          <label className="user-form__label">Role *</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="user-form__select"
            disabled={isLoading}
          >
            <option value="user">Học viên</option>
            <option value="instructor">Giảng viên</option>
            <option value="admin">Quản trị viên</option>
          </select>
        </div>

        {/* Status */}
        <div className="user-form__group">
          <label className="user-form__label">Trạng thái *</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="user-form__select"
            disabled={isLoading}
          >
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
            <option value="suspended">Bị khóa</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="user-form__actions">
        <button
          type="button"
          className="user-form__btn user-form__btn--cancel"
          onClick={onCancel}
          disabled={isLoading}
        >
          Hủy
        </button>
        <button
          type="submit"
          className="user-form__btn user-form__btn--submit"
          disabled={isLoading}
        >
          {isLoading ? "Đang xử lý..." : user ? "Cập nhật" : "Tạo"}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
