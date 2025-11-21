// Giả định:
import type { CourseDto } from "@/features/course/types";
import type { PagedResponse } from "@/common/types"; // Bao bọc API chung
import { courseApi } from "@/features/course/services/courseApi";
import { useQuery } from "@tanstack/react-query";

// Sửa lại hook:
export const useCourses = (
  page: number,
  limit: number,
  searchTerm: string,
  level: string,
  status: string = "all"
) => {
  // ⚠️ Khai báo kiểu trả về (TData) cho useQuery
  return useQuery<PagedResponse<CourseDto[]>, Error>({
    // Giả định Error là kiểu lỗi
    queryKey: ["courses", page, limit, searchTerm, level, status],

    queryFn: async () => {
      const res = await courseApi.getPaged(
        page,
        limit,
        searchTerm,
        level,
        status
      );
      // ✅ Bắt buộc phải trả về kiểu ApiResponse<PaginationData>
      return res;
    },

    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // Tối ưu: Đặt cache time (ví dụ: 5 phút)
  });
};
