import api from "@/api/axios";
import type { PagedResponse } from "@/common/types";
import type { Course, Lesson } from "@/features/course/types";
const url = "/course";

export const courseApi = {
  // 🧠 Lấy danh sách có phân trang
  getPaged: async (
    page: number,
    pageSize: number,
    search?: string,
    level: string
  ) => {
    // ⚙️ Xử lý param để không gửi search rỗng
    const params: Record<string, any> = { page, pageSize, level };
    if (search && search.trim() !== "" && search !== '""') {
      params.search = search.trim();
    }
    const fullUrl = `/courses/paged?` + new URLSearchParams(params).toString();
    console.log("📡 Request URL:", fullUrl);
    const res = await api.get<PagedResponse<Course>>(`/courses/paged`, {
      params,
    });
    return res.data;
  },

  // 🧠 Lấy 1 khóa học theo ID
  getById: async (id: string) => {
    const res = await api.get<Course>(`/courses/${id}`);
    return res.data;
  },
  getLessonById: async (id: string | undefined) => {
    const res = await api.get<Lesson>(`/lessons/${id}`);
    return res.data;
  },
  getBySlug: async (slug: string | undefined) => {
    const res = await api.get<Course>(`/courses/slug/${slug}`);
    return res.data;
  },

  // 🧠 Tạo mới khóa học
  create: async (data: any) => {
    const res = await api.post<Course>(url, data);
    return res.data;
  },
};
