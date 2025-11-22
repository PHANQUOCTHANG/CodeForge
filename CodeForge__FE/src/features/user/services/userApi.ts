import api from "@/api/axios";
import type { ApiResponse, PagedResponse } from "@/common/types";
import type {
  UserDto,
  CreateUserDto,
  UpdateUserDto,
  PaginatedUsers,
  UserFilters,
} from "@/features/user/types";

const url = "/users";

export const userApi = {
  // 🧠 Lấy danh sách người dùng có phân trang
  getPaged: async (
    page: number,
    pageSize: number,
    search?: string,
    role?: string,
    status?: string
  ) => {
    const params: Record<string, any> = { page, pageSize };

    if (search && search.trim() !== "") {
      params.search = search.trim();
    }
    if (role && role !== "") {
      params.role = role;
    }
    if (status && status !== "") {
      params.status = status;
    }

    const res = await api.get<PagedResponse<UserDto[]>>(`${url}`, { params });
    return res.data;
  },

  // 🧠 Lấy 1 user theo ID
  getById: async (id: string) => {
    const res = await api.get<ApiResponse<UserDto>>(`${url}/${id}`);
    return res.data;
  },

  // 🧠 Tạo mới user
  create: async (data: CreateUserDto) => {
    const res = await api.post<ApiResponse<UserDto>>(url, data);
    return res.data;
  },

  // 🧠 Cập nhật user
  update: async (id: string, data: UpdateUserDto) => {
    const res = await api.put<ApiResponse<UserDto>>(`${url}/${id}`, data);
    return res.data;
  },

  // 🧠 Xóa user
  delete: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`${url}/${id}`);
    return res.data;
  },

  // 🧠 Lấy danh sách user (không phân trang - tất cả)
  getAll: async () => {
    const res = await api.get<ApiResponse<UserDto[]>>(url);
    return res.data;
  },
};
