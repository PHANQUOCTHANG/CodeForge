import { useQuery } from "@tanstack/react-query";
import { courseApi } from "@/features/course/services/courseApi";

export const useCourses = (page: number, limit: number, searchTerm: string) => {
  return useQuery({
    queryKey: ["courses", page, searchTerm],
    queryFn: async () => {
      const res = await courseApi.getPaged(page, limit, searchTerm);
      return res;
    },
    keepPreviousData: true,
  });
};
