import api from "@/api/axios";
import type { ApiResponse } from "@/common/types";
import type { CourseCategory } from "@/features/category/types";

export const courseCategoryApi = {
  // 🧠 Lấy 1 khóa học theo ID
  get: async () => {
    const res = await api.get<ApiResponse<CourseCategory[]>>(`/CourseCategory`);
    return res.data;
  },
};
