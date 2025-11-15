import { useQuery } from "@tanstack/react-query";
import { courseApi } from "../services/courseApi";
import type { Lesson } from "@/features/course/types";

export const useCourseLesson = (id: string | undefined) => {
  return useQuery<Lesson>({
    queryKey: ["lessons", id],
    queryFn: () => courseApi.getLessonById(id),
    enabled: !!id,
    staleTime: 300000,
    select: (apiResponse) => apiResponse.data,
  });
};
