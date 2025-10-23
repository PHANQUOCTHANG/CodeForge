import api from "./axios"; // axios đã config baseURL, token interceptor...

const url = "/course";

export interface Course {
  courseId: string;
  title: string;
  description: string;
  level: string;
  language: string;
  createdAt: string;
  status: string;
  thumbnail?: string;
}

export interface PagedResponse<T> {
  data: T[];
  totalItems: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}

export const courseApi = {
  // 🧠 Lấy danh sách có phân trang
  getPaged: async (page: number, pageSize: number, search?: string) => {
    // ⚙️ Xử lý param để không gửi search rỗng
    const params: Record<string, any> = { page, pageSize };
    if (search && search.trim() !== "" && search !== '""') {
      params.search = search.trim();
    }
    const fullUrl = `${url}/paged?` + new URLSearchParams(params).toString();
    console.log("📡 Request URL:", fullUrl);
    const res = await api.get<PagedResponse<Course>>(`${url}/paged`, {
      params,
    });
    return res.data;
  },

  // 🧠 Lấy 1 khóa học theo ID
  getById: async (id: string) => {
    const res = await api.get<Course>(`${url}/${id}`);
    return res.data;
  },
  getBySlug: async (slug: string | undefined) => {
    const res = await api.get<Course>(`${url}/slug/${slug}`);
    return res.data;
  },

  // 🧠 Tạo mới khóa học
  create: async (data: any) => {
    const res = await api.post<Course>(url, data);
    return res.data;
  },
};
