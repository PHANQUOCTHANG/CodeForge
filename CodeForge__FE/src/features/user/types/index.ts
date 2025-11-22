// User Management Types

// User DTO từ API
export interface UserDto {
  userId: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  role: "Admin" | "Instructor" | "Student";
  status: "Active" | "Inactive" | "Suspended";
  enrolledCourses?: number;
  createdAt: string;
  updatedAt: string;
}

// Create User Request
export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role: "Admin" | "Instructor" | "Student";
  status: "Active" | "Inactive";
  avatar?: string;
}

// Update User Request
export interface UpdateUserDto {
  username?: string;
  email?: string;
  fullName?: string;
  role?: "Admin" | "Instructor" | "Student";
  status?: "Active" | "Inactive" | "Suspended";
  avatar?: string;
}

// Pagination Response
export interface PaginatedUsers {
  data: UserDto[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Filter & Search Options
export interface UserFilters {
  page: number;
  pageSize: number;
  search?: string;
  role?: string;
  status?: string;
}

// User for Table Display
export interface UserTableData extends UserDto {
  actions?: string[];
}

// Role Badge Data
export type UserRole = "Admin" | "Instructor" | "Student";

// Status Badge Data
export type UserStatus = "Active" | "Inactive" | "Suspended";

// User Statistics
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  adminCount: number;
  instructorCount: number;
  studentCount: number;
}
