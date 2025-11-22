import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type { CourseCategory } from "@/features/category/types";
import { courseCategoryApi } from "@/features/category/service/categoryService";
import type { ApiResponse } from "@/common/types";

export const useCourseCategory = (): UseQueryResult<
  CourseCategory[],
  Error
> => {
  return useQuery<ApiResponse<CourseCategory[]>, Error, CourseCategory[]>({
    queryKey: ["courseCategory"],
    queryFn: () => courseCategoryApi.get(),
    staleTime: 300000,
    select: (apiResponse) => apiResponse.data,
  });
};
