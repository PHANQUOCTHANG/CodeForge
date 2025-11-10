export interface UpdateLessonProgressDto {
  lessonId: string;
  status: "in_progress" | "completed" | "reviewed"; // nên dùng enum hoặc union type
}
