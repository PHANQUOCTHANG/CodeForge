import type {
  LessonDto,
  LessonOutline,
  UpdateLessonDto,
} from "@/features/Lesson/types";

export interface CreateModuleDto {
  courseId: string;
  title: string;
  orderIndex: number;
  isDeleted: boolean;
}
export interface UpdateModuleDto {
  moduleId: string;
  courseId: string;
  title: string;
  orderIndex: number;
  lessons: UpdateLessonDto[];
}
export interface Module {
  moduleId: string;
  courseId: string;
  title: string;
  orderIndex: number;
  isDeleted: boolean;
}
export interface ModuleDto {
  moduleId: string;
  courseId: string;
  title: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
  lessons: LessonDto[];
  isDeleted?: boolean;
}
export interface ModuleOutline {
  moduleId: string;
  courseId: string;
  title: string;
  orderIndex: number;
  lessons: LessonOutline[]; // Chứa danh sách các bài học (outline)
}
