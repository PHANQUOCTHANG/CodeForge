import type { CodingProblem } from "@/features/course";

export interface Lesson {
  lessonId: string;
  moduleId: string;
  title: string;
  lessonType: "video" | "text" | "quiz" | "coding";
  orderIndex: number;
  isDeleted: boolean;
  duration: number;
}
export interface CreateLessonDto {
  lessonId: string;
  moduleId: string;
  title: string;
  lessonType: "video" | "text" | "quiz" | "coding";
  duration: number; // tính bằng giây
  orderIndex: number;
  isCompleted: boolean; // ✅ Thêm trường isCompleted để biết bài học đã hoàn thành hay chưa
  // Chỉ MỘT trong các trường này sẽ có dữ liệu, 3 trường còn lại sẽ là NULL
  videoContent: LessonVideoDto | null;
  textContent: LessonTextDto | null;
  quizContent: LessonQuizDto | null;
  codingProblem: CodingProblem | null;
}
export interface UpdateLessonDto {
  lessonId: string;
  moduleId: string;
  title: string;
  lessonType: "video" | "text" | "quiz" | "coding";
  duration: number; // tính bằng giây
  orderIndex: number;
  isCompleted: boolean; // ✅ Thêm trường isCompleted để biết bài học đã hoàn thành hay chưa
  // Chỉ MỘT trong các trường này sẽ có dữ liệu, 3 trường còn lại sẽ là NULL
  videoContent: LessonVideoDto | null;
  textContent: LessonTextDto | null;
  quizContent: LessonQuizDto | null;
  codingProblem: CodingProblem | null;
}
export interface LessonDto {
  lessonId: string;
  moduleId: string;
  title: string;
  isDeleted?: boolean;
  lessonType: "video" | "text" | "quiz" | "coding";
  duration: number; // tính bằng giây
  orderIndex: number;
  isCompleted: boolean; // ✅ Thêm trường isCompleted để biết bài học đã hoàn thành hay chưa
  // Chỉ MỘT trong các trường này sẽ có dữ liệu, 3 trường còn lại sẽ là NULL
  videoContent: LessonVideoDto | null;
  textContent: LessonTextDto | null;
  quizContent: LessonQuizDto | null;
  codingProblem: CodingProblem | null;
}
export interface LessonOutline {
  lessonId: string;
  moduleId: string;
  duration: number; // tính bằng giây
  title: string;
  lessonType: "video" | "text" | "quiz" | "coding";
  orderIndex: number;
  isCompleted?: boolean;
  videoContent: LessonVideoDto | null;
  textContent: LessonTextDto | null;
  quizContent: LessonQuizDto | null;
  codingProblem: CodingProblem | null;
}

export interface LessonVideoDto {
  lessonId: string;
  videoUrl: string;
  caption?: string;
  duration: number;
}

/**
 * @description DTO chi tiết cho nội dung bài học TEXT
 * (Tương ứng với 'textContent' trong LessonDto)
 */
export interface LessonTextDto {
  lessonId: string;
  content: string; // Nội dung HTML/Markdown
}

/**
 * @description DTO cho một câu hỏi trắc nghiệm
 */
export interface QuizQuestionDto {
  lessonQuizId: string;
  questionId: string;
  question: string;
  answers: string[]; // Mảng các lựa chọn [A, B, C, D]
  explanation: string;
  correctIndex: number; // Index của câu trả lời đúng (ví dụ: 2)
}

/**
 * @description DTO chi tiết cho nội dung bài học QUIZ
 * (Tương ứng với 'quizContent' trong LessonDto)
 */
export interface LessonQuizDto {
  lessonId: string;
  title: string;
  description?: string;
  questions: QuizQuestionDto[];
}
