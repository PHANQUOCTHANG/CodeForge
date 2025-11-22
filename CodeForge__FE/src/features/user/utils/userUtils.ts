import type { UserDto, UserRole, UserStatus } from "@/features/user/types";

/**
 * Format ngày thành chuỗi dễ đọc
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

/**
 * Lấy label cho role
 */
export const getRoleLabel = (role: UserRole): string => {
  const roleMap: Record<UserRole, string> = {
    Admin: "Quản trị viên",
    Instructor: "Giảng viên",
    Student: "Học viên",
  };
  return roleMap[role] || role;
};

/**
 * Lấy màu cho role badge
 */
export const getRoleColor = (role: UserRole): string => {
  const colorMap: Record<UserRole, string> = {
    Admin: "#ef4444", // Red
    Instructor: "#f59e0b", // Amber
    Student: "#3b82f6", // Blue
  };
  return colorMap[role] || "#6b7280";
};

/**
 * Lấy label cho status
 */
export const getStatusLabel = (status: UserStatus): string => {
  const statusMap: Record<UserStatus, string> = {
    Active: "Hoạt động",
    Inactive: "Không hoạt động",
    Suspended: "Bị khóa",
  };
  return statusMap[status] || status;
};

/**
 * Lấy màu cho status badge
 */
export const getStatusColor = (status: UserStatus): string => {
  const colorMap: Record<UserStatus, string> = {
    Active: "#10b981", // Green
    Inactive: "#6b7280", // Gray
    Suspended: "#dc2626", // Dark Red
  };
  return colorMap[status] || "#6b7280";
};

/**
 * Validate email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate username (3-20 characters, alphanumeric + underscore)
 */
export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

/**
 * Validate password (min 8 characters, must have uppercase, lowercase, number)
 */
export const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validate password strength (0-4)
 */
export const getPasswordStrength = (password: string): number => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[!@#$%^&*]/.test(password)) strength++;
  return Math.min(strength, 4);
};

/**
 * Get password strength label
 */
export const getPasswordStrengthLabel = (strength: number): string => {
  const labels = ["Rất yếu", "Yếu", "Trung bình", "Mạnh", "Rất mạnh"];
  return labels[strength] || "Rất yếu";
};

/**
 * Get password strength color
 */
export const getPasswordStrengthColor = (strength: number): string => {
  const colors = ["#dc2626", "#f97316", "#eab308", "#84cc16", "#22c55e"];
  return colors[strength] || "#6b7280";
};

/**
 * Lọc duplicate users
 */
export const filterUniqueUsers = (users: UserDto[]): UserDto[] => {
  const seen = new Set<string>();
  return users.filter((user) => {
    if (seen.has(user.userId)) {
      return false;
    }
    seen.add(user.userId);
    return true;
  });
};

/**
 * Sort users theo field
 */
export const sortUsers = (
  users: UserDto[],
  field: keyof UserDto,
  order: "asc" | "desc" = "asc"
): UserDto[] => {
  return [...users].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];

    if (aValue < bValue) return order === "asc" ? -1 : 1;
    if (aValue > bValue) return order === "asc" ? 1 : -1;
    return 0;
  });
};
