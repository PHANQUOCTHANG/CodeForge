import { userApi } from "@/features/user/services/userApi";
import type {
  UserDto,
  PaginatedUsers,
  CreateUserDto,
  UpdateUserDto,
} from "@/features/user/types";
import type { ApiResponse } from "@/common/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook để lấy danh sách user có phân trang
 * @param page - Trang hiện tại
 * @param pageSize - Số lượng user per page
 * @param search - Tìm kiếm theo tên/email
 * @param role - Lọc theo role (Admin, Instructor, Student)
 * @param status - Lọc theo status (Active, Inactive, Suspended)
 */
export const useUsers = (
  page: number = 1,
  pageSize: number = 10,
  search?: string,
  role?: string,
  status?: string
) => {
  return useQuery<ApiResponse<PaginatedUsers>, Error>({
    queryKey: ["users", page, pageSize, search, role, status],
    queryFn: async () => {
      const res = await userApi.getPaged(page, pageSize, search, role, status);
      return res;
    },
    staleTime: 5 * 60 * 1000, // Cache 5 phút
    gcTime: 10 * 60 * 1000, // Garbage collection 10 phút
  });
};

/**
 * Hook để lấy chi tiết 1 user
 * @param id - User ID
 */
export const useUserDetail = (id: string) => {
  return useQuery<ApiResponse<UserDto>, Error>({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await userApi.getById(id);
      return res;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!id, // Chỉ chạy khi có id
  });
};

/**
 * Hook để lấy tất cả user (không phân trang)
 */
export const useAllUsers = () => {
  return useQuery<ApiResponse<UserDto[]>, Error>({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await userApi.getAll();
      return res;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};

/**
 * Hook để tạo user mới
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<UserDto>, Error, CreateUserDto>({
    mutationFn: async (data) => {
      return await userApi.create(data);
    },
    onSuccess: () => {
      // Invalidate users list để refetch
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    },
  });
};

/**
 * Hook để cập nhật user
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<UserDto>,
    Error,
    { id: string; data: UpdateUserDto }
  >({
    mutationFn: async ({ id, data }) => {
      return await userApi.update(id, data);
    },
    onSuccess: (data, variables) => {
      // Update single user cache
      queryClient.invalidateQueries({ queryKey: ["user", variables.id] });
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

/**
 * Hook để xóa user
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, Error, string>({
    mutationFn: async (id) => {
      return await userApi.delete(id);
    },
    onSuccess: () => {
      // Invalidate users list để refetch
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    },
  });
};
