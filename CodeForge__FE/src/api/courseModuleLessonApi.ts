import api from "./axios";

// ============================================================================
// Module API Types & Services
// ============================================================================

export interface CreateModuleDto {
  courseId: string;
  title: string;
  description?: string;
  orderIndex?: number;
}

export interface UpdateModuleDto {
  moduleId: string;
  title: string;
  description?: string;
  orderIndex?: number;
}

export interface ModuleDto {
  moduleId: string;
  courseId: string;
  title: string;
  description?: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export const moduleApi = {
  // Get module by ID (with lessons)
  getById: (id: string) => api.get<{ data: ModuleDto }>(`/api/Modules/${id}`),

  // Get all modules for a course
  getByCourseId: (courseId: string) =>
    api.get<{ data: ModuleDto[] }>(`/api/Modules/course/${courseId}`),

  // Create new module
  create: (dto: CreateModuleDto) =>
    api.post<{ data: ModuleDto }>(`/api/Modules/create`, dto),

  // Update module
  update: (dto: UpdateModuleDto) =>
    api.put<{ data: ModuleDto }>(`/api/Modules/update`, dto),

  // Delete module
  delete: (id: string) => api.delete(`/api/Modules/${id}`),
};

// ============================================================================
// Lesson API Types & Services
// ============================================================================

export type LessonType = "video" | "text" | "quiz" | "coding";

export interface LessonBase {
  moduleId: string;
  title: string;
  description?: string;
  orderIndex?: number;
  type: LessonType;
}

export interface CreateVideoLessonDto extends LessonBase {
  type: "video";
  videoUrl: string;
  duration?: number;
}

export interface CreateTextLessonDto extends LessonBase {
  type: "text";
  content: string;
}

export interface CreateQuizLessonDto extends LessonBase {
  type: "quiz";
  questions: Array<{
    title: string;
    options: string[];
    correctAnswer: number;
  }>;
}

export interface CreateCodingLessonDto extends LessonBase {
  type: "coding";
  problemDescription: string;
  initialCode?: string;
  language: string;
  problemId?: string; // Reference to CodingProblem
}

export type CreateLessonDto =
  | CreateVideoLessonDto
  | CreateTextLessonDto
  | CreateQuizLessonDto
  | CreateCodingLessonDto;

export interface LessonDto {
  lessonId: string;
  moduleId: string;
  title: string;
  description?: string;
  orderIndex: number;
  type: LessonType;
  content?: string; // for text lessons
  videoUrl?: string; // for video lessons
  duration?: number; // for video lessons
  questions?: Record<string, unknown>[]; // for quiz lessons
  problemDescription?: string; // for coding lessons
  initialCode?: string; // for coding lessons
  language?: string; // for coding lessons
  createdAt: string;
  updatedAt: string;
}

export const lessonApi = {
  // Get lesson by ID
  getById: (id: string) => api.get<{ data: LessonDto }>(`/api/Lessons/${id}`),

  // Get all lessons for a module
  getByModuleId: (moduleId: string) =>
    api.get<{ data: LessonDto[] }>(`/api/Lessons/module/${moduleId}`),

  // Create new lesson (type-specific payload)
  create: (dto: CreateLessonDto) =>
    api.post<{ data: LessonDto }>(`/api/Lessons/create`, dto),
};

// ============================================================================
// Course API Extension (for creating with nested modules/lessons)
// ============================================================================

export interface CreateCourseWithModulesDto {
  title: string;
  description: string;
  level: string;
  language: string;
  slug: string;
  modules: Array<{
    title: string;
    description?: string;
    orderIndex: number;
    lessons?: Array<{
      title: string;
      description?: string;
      orderIndex?: number;
      type: LessonType;
      // Type-specific fields will be spread here
      videoUrl?: string;
      content?: string;
      problemDescription?: string;
      initialCode?: string;
      language?: string;
    }>;
  }>;
}

export const courseLessonApi = {
  /**
   * Create course with nested modules and lessons
   * This would require backend support for nested creation
   * Otherwise, create course first, then modules, then lessons separately
   */
  createWithModules: (dto: CreateCourseWithModulesDto) =>
    api.post<{ data: Record<string, unknown> }>(
      `/api/Courses/create-with-modules`,
      dto
    ),
};
