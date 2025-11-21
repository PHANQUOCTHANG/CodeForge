import api from "@/api/axios";
import type { ApiResponse } from "@/common/types";
import type { CreateLessonDto, LessonDto } from "@/features/Lesson/types";

export const lessonApi = {
  // Get lesson by ID
  getById: async (id: string | undefined) => {
    const res = await api.get<ApiResponse<LessonDto>>(`/Lessons/${id}`);
    return res.data;
  },
  // Get all lessons for a module
  getByModuleId: async (moduleId: string | undefined) => {
    const res = await api.get<ApiResponse<LessonDto[]>>(
      `/Lessons/module/${moduleId}`
    );
    return res.data;
  },
  // Create new lesson (type-specific payload)
  create: async (dto: CreateLessonDto) => {
    const res = await api.post<ApiResponse<LessonDto>>(`/Lessons/create`, dto);
    return res.data;
  },
};
