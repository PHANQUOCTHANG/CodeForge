import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from "@tanstack/react-query";

import type {
  CourseCategory,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@/features/course-category/types";
import { courseCategoryApi } from "@/features/course-category/service/categoryService";
import type { ApiResponse } from "@/common/types";

// 📋 Lấy tất cả categories
export const useCourseCategories = (): UseQueryResult<
  CourseCategory[],
  Error
> => {
  return useQuery<ApiResponse<CourseCategory[]>, Error, CourseCategory[]>({
    queryKey: ["courseCategories"],
    queryFn: () => courseCategoryApi.getAll(),
    staleTime: 300000, // 5 minutes
    select: (apiResponse) => apiResponse.data,
  });
};

// 🔍 Lấy category theo ID
export const useCourseCategoryById = (id: string) => {
  return useQuery<ApiResponse<CourseCategory>, Error, CourseCategory>({
    queryKey: ["courseCategory", id],
    queryFn: () => courseCategoryApi.getById(id),
    staleTime: 300000,
    select: (apiResponse) => apiResponse.data,
    enabled: !!id,
  });
};

// ➕ Tạo category mới
export const useCreateCategory = (): UseMutationResult<
  ApiResponse<CourseCategory>,
  Error,
  CreateCategoryDto
> => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<CourseCategory>, Error, CreateCategoryDto>({
    mutationFn: (dto: CreateCategoryDto) => courseCategoryApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courseCategories"] });
    },
  });
};

// ✏️ Cập nhật category
export const useUpdateCategory = (): UseMutationResult<
  ApiResponse<CourseCategory>,
  Error,
  { id: string; dto: UpdateCategoryDto }
> => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<CourseCategory>,
    Error,
    { id: string; dto: UpdateCategoryDto }
  >({
    mutationFn: ({ id, dto }) => courseCategoryApi.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courseCategories"] });
    },
  });
};

// 🗑️ Xóa category
export const useDeleteCategory = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => courseCategoryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courseCategories"] });
    },
  });
};
