// API Response
export interface CourseCategory {
  categoryId: string;
  name: string;
  description?: string;
  icon?: string;
}

// Form DTOs
export interface CreateCategoryDto {
  name: string;
  description?: string;
  icon?: string;
}

export interface UpdateCategoryDto {
  categoryId: string;
  name: string;
  description?: string;
  icon?: string;
}
