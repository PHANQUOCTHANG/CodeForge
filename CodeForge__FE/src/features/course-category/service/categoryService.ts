import api from "@/api/axios";
import type { ApiResponse } from "@/common/types";
import type {
  CourseCategory,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@/features/course-category/types";

export const courseCategoryApi = {
  // 📋 Lấy tất cả categories
  getAll: async () => {
    const res = await api.get<ApiResponse<CourseCategory[]>>("/CourseCategory");
    return res.data;
  },

  // 🔍 Lấy category theo ID
  getById: async (id: string) => {
    const res = await api.get<ApiResponse<CourseCategory>>(
      `/CourseCategory/${id}`
    );
    return res.data;
  },

  // ➕ Tạo category mới
  create: async (dto: CreateCategoryDto) => {
    const res = await api.post<ApiResponse<CourseCategory>>(
      "/CourseCategory",
      dto
    );
    return res.data;
  },

  // ✏️ Cập nhật category
  update: async (id: string, dto: UpdateCategoryDto) => {
    const res = await api.put<ApiResponse<CourseCategory>>(
      `/CourseCategory/${id}`,
      {
        ...dto,
        categoryId: id,
      }
    );
    return res.data;
  },

  // 🗑️ Xóa category
  delete: async (id: string) => {
    await api.delete(`/CourseCategory/${id}`);
  },
};
