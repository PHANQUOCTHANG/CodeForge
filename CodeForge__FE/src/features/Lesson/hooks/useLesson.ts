import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { ApiResponse } from "@/common/types";
import { lessonApi } from "@/features/Lesson/service/lessonService";
import type { LessonDto } from "@/features/Lesson/types";
export const useLesson = (
  id: string | undefined
): UseQueryResult<LessonDto, Error> => {
  return useQuery<ApiResponse<LessonDto>, Error, LessonDto>({
    queryKey: ["lessons", id],
    queryFn: () => lessonApi.getById(id),
    enabled: !!id,
    staleTime: 300000,
    select: (apiResponse) => apiResponse.data,
  });
};
