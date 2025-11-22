import api from "@/api/axios";
import type { ApiResponse } from "@/common/types";
import type { AdminDashboardData } from "@/features/dashboard/types";

const url = "/dashboard";

export const dashboardApi = {
  // 🧠 Lấy toàn bộ thống kê dashboard
  getStats: async () => {
    const res = await api.get<ApiResponse<AdminDashboardData>>(`${url}/stats`);
    return res.data;
  },

  // 🧠 Lấy thống kê bài nộp
  getSubmissionStats: async () => {
    const res = await api.get<ApiResponse<any>>(`${url}/submissions/stats`);
    return res.data;
  },

  // 🧠 Lấy danh sách bài nộp gần đây
  getRecentSubmissions: async (limit: number = 10, page: number = 1) => {
    const res = await api.get<ApiResponse<any>>(`${url}/submissions/recent`, {
      params: { limit, page },
    });
    return res.data;
  },

  // 🧠 Lấy danh sách khóa học phổ biến
  getTopCourses: async (limit: number = 5) => {
    const res = await api.get<ApiResponse<any>>(`${url}/courses/top`, {
      params: { limit },
    });
    return res.data;
  },
};
