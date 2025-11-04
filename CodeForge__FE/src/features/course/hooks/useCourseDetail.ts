import { useQuery } from "@tanstack/react-query";
import { courseApi } from "../services/courseApi";
import type { Course } from "@/features/course/types";

export const useCourseDetail = (
  slug: string | undefined,
  isUpdate: boolean = false
) => {
  return useQuery<Course>({
    queryKey: ["course", slug, isUpdate],
    queryFn: () => courseApi.getBySlug(slug),
    enabled: !!slug,
    staleTime: 300000,
    select: (apiResponse) => apiResponse.data,
  });
};
