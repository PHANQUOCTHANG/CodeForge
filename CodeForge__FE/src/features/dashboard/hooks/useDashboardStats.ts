import { dashboardApi } from "@/features/dashboard/services/dashboardApi";
import type { AdminDashboardData } from "@/features/dashboard/types";
import type { ApiResponse } from "@/common/types";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook để lấy toàn bộ dữ liệu dashboard
 * Bao gồm: stats, submissions, top courses, charts data
 */
export const useDashboardStats = () => {
  return useQuery<ApiResponse<AdminDashboardData>, Error>({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const res = await dashboardApi.getStats();
      return res;
    },
    staleTime: 5 * 60 * 1000, // Cache 5 phút
    gcTime: 10 * 60 * 1000, // Garbage collection sau 10 phút
    refetchInterval: 30 * 1000, // Auto refetch mỗi 30 giây
  });
};

/**
 * Hook để lấy thống kê bài nộp (passed, failed, pending)
 */
export const useSubmissionStats = () => {
  return useQuery<ApiResponse<any>, Error>({
    queryKey: ["dashboard", "submission-stats"],
    queryFn: async () => {
      const res = await dashboardApi.getSubmissionStats();
      return res;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook để lấy danh sách bài nộp gần đây
 * @param limit - Số lượng bài nộp trả về (mặc định: 10)
 * @param page - Trang hiện tại (mặc định: 1)
 */
export const useRecentSubmissions = (limit: number = 10, page: number = 1) => {
  return useQuery<ApiResponse<any>, Error>({
    queryKey: ["dashboard", "recent-submissions", limit, page],
    queryFn: async () => {
      const res = await dashboardApi.getRecentSubmissions(limit, page);
      return res;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook để lấy danh sách khóa học phổ biến
 * @param limit - Số lượng khóa học trả về (mặc định: 5)
 */
export const useTopCourses = (limit: number = 5) => {
  return useQuery<ApiResponse<any>, Error>({
    queryKey: ["dashboard", "top-courses", limit],
    queryFn: async () => {
      const res = await dashboardApi.getTopCourses(limit);
      return res;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
