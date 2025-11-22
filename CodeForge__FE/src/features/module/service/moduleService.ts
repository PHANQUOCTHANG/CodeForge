import api from "@/api/axios";
import type {
  CreateModuleDto,
  ModuleDto,
  UpdateModuleDto,
} from "@/features/module/types";

export const moduleApi = {
  // Get module by ID (with lessons)
  getById: (id: string) => api.get<{ data: ModuleDto }>(`/Modules/${id}`),

  // Get all modules for a course
  getByCourseId: (courseId: string) =>
    api.get<{ data: ModuleDto[] }>(`/Modules/course/${courseId}`),
  // Create new module
  create: (dto: CreateModuleDto) =>
    api.post<{ data: ModuleDto }>(`/Modules/create`, dto),

  // Update module
  update: (dto: UpdateModuleDto) =>
    api.put<{ data: ModuleDto }>(`/Modules/update`, dto),
  // Delete module
  delete: (id: string) => api.delete(`/api/Modules/${id}`),
};
