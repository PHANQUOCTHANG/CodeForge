import api from "@/api/axios";
import type { ApiResponse, PagedResponse } from "@/common/types";
import type {
  CourseDetail,
  CourseDto,
  CreateCourseDto,
  UpdateCourseDto,
} from "@/features/course/types";

const url = "/courses";

export const courseApi = {
  // 🧠 Lấy danh sách có phân trang
  getPaged: async (
    page: number,
    pageSize: number,
    search?: string,
    level?: string,
    status?: string = "all"
  ) => {
    // ⚙️ Xử lý param để không gửi search rỗng
    const params: Record<string, any> = { page, pageSize };
    if (level !== undefined && level !== null && level !== "") {
      params.level = level;
    }
    if (search && search.trim() !== "" && search !== '""') {
      params.search = search.trim();
    }
    if (status && status !== "all") {
      params.status = status;
    }
    const fullUrl = `/courses/paged?` + new URLSearchParams(params).toString();
    console.log("📡 Request URL:", fullUrl);
    const res = await api.get<PagedResponse<CourseDto[]>>(`/courses/paged`, {
      params,
    });
    return res.data;
  },

  // 🧠 Lấy 1 khóa học theo ID
  getById: async (id: string) => {
    const res = await api.get<ApiResponse<CourseDetail>>(`/courses/${id}`);
    return res.data;
  },
  getBySlug: async (slug: string | undefined) => {
    const res = await api.get<ApiResponse<CourseDetail>>(
      `/courses/slug/${slug}`
    );
    return res.data;
  },
  getByIdAdmin: async (id: string | undefined) => {
    const res = await api.get<ApiResponse<CourseDetail>>(
      `/courses/admin/${id}`
    );
    return res.data;
  },
  update: async (courseId: string, data: UpdateCourseDto) => {
    const res = await api.put<ApiResponse<CourseDetail>>(
      `${url}/${courseId}`,
      data
    );
    return res.data;
  },
  // 🧠 Tạo mới khóa học
  create: async (data: CreateCourseDto) => {
    const res = await api.post<ApiResponse<CourseDetail>>(url, data);
    return res.data;
  },
};
