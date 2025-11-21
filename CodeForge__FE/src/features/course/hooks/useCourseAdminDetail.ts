import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { courseApi } from "../services/courseApi";
import type { CourseDetail } from "@/features/course/types";
import type { ApiResponse } from "@/common/types";

export const useCourseAdminDetail = (
  courseId: string | undefined
): UseQueryResult<CourseDetail, Error> => {
  return useQuery<ApiResponse<CourseDetail>, Error, CourseDetail>({
    queryKey: ["course", "admin", courseId], // Key khác với public
    queryFn: () => courseApi.getByIdAdmin(courseId!),
    enabled: !!courseId,
    staleTime: 0, // Luôn lấy dữ liệu mới nhất
    select: (res) => res.data,
  });
};
