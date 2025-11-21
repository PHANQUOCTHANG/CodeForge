import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { courseApi } from "../services/courseApi";
import type { CourseDetail } from "@/features/course/types";
import type { ApiResponse } from "@/common/types";

export const useCourseDetail = (
  slug: string | undefined
): UseQueryResult<CourseDetail, Error> => {
  return useQuery<ApiResponse<CourseDetail>, Error, CourseDetail>({
    // Type 1: TQueryFnData = ApiResponse<Course>
    // Type 2: TError = Error
    // Type 3: TData (Kiểu cuối cùng) = Course

    queryKey: ["course", slug],

    // queryFn trả về Promise<ApiResponse<Course>> -> Khớp với TQueryFnData
    queryFn: () => courseApi.getBySlug(slug),

    enabled: !!slug,
    staleTime: 300000,

    // select nhận ApiResponse<Course> và trả về Course -> Khớp với TData
    select: (apiResponse) => apiResponse.data,
  });
};
