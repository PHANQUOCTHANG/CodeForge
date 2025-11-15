import type { TestCase } from "@/features/practice/types";

export interface Course {
  courseID: string;
  title: string;
  slug: string;
  thumbnail?: string;
  description?: string;
  level: "beginner" | "intermediate" | "advanced";
  language: string;
  status: string;
  price: number;
  duration: number;
  rating: number;
  totalRatings: number;
  totalStudents: number;
  discount: number;
  badge?: string;
  author: string;
  categoryName: string;
  lessonCount: number;
  isEnrolled: boolean;
  progress: number;
}

export interface CodingProblem {
  problemId: string; // UNIQUEIDENTIFIER
  lessonId?: string | null; // Cho phép null

  title: string; // Tiêu đề bài toán
  slug: string; // Dạng URL-friendly (ví dụ: two-sum)
  difficulty: "Easy" | "Medium" | "Hard"; // Mức độ (có thể dùng enum)
  description?: string | null; // Mô tả bài toán
  tags?: string | null; // Các tag (ví dụ: "Array, HashMap")

  functionName?: string | null; // Tên hàm (ví dụ: twoSum)
  parameters?: string | null; // Các tham số đầu vào
  returnType?: string | null; // Kiểu dữ liệu trả về
  notes?: string | null; // Ghi chú thêm
  constraints?: string | null; // Ràng buộc bài toán

  timeLimit: number; // Giới hạn thời gian (ms)
  memoryLimit: number; // Giới hạn bộ nhớ (MB)

  createdAt: string; // ISO Date
  updatedAt: string; // ISO Date
  isDeleted: boolean; // Xóa mềm
}

export interface Lesson {
  lessonId: string;
  moduleId: string;
  title: string;
  lessonType: "video" | "text" | "quiz" | "coding";
  orderIndex: number;
  isDeleted: boolean;
  isCompleted?: boolean;
  isLocked?: boolean;
}

export interface Module {
  moduleId: string;
  courseId: string;
  title: string;
  orderIndex: number;
  isDeleted: boolean;
  lessons: Lesson[];
}

export interface Review {
  userId: string;
  usename: string;
  avatar: string;
  rating: number;
  comment: string;
  createdAt: string;
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
  questionId: string;
  question: string;
  answers: string[]; // Mảng các lựa chọn [A, B, C, D]
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

/**
 * @description DTO cho một Test Case của bài code
 */

/**
 * @description DTO chi tiết cho nội dung bài học CODING
 * (Tương ứng với 'codingProblem' trong LessonDto)
 * (Interface 'CodingProblems' cũ của bạn giống như 1 list item, đây là DTO chi tiết)
 */
export interface ProblemDto {
  problemId: string;
  title: string;
  difficulty: string; // "Easy", "Medium", "Hard"
  description: string; // Nội dung đề bài (HTML/Markdown)
  timeLimit: number;
  memoryLimit: number;
  initialCode?: string; // Code mẫu
  solution?: string; // Code giải pháp
  functionName?: string; // Tên hàm cần implement
  testCases: TestCase[];
  slug: string;
}

// --- 2. DTO Chi tiết của BÀI HỌC (Lesson) ---

/**
 * @description DTO chi tiết của MỘT BÀI HỌC (trả về từ API /api/lessons/{id})
 * Đây là DTO chính để render nội dung bên phải.
 */
export interface LessonDto {
  lessonId: string;
  moduleId: string;
  title: string;
  lessonType: "video" | "text" | "quiz" | "coding";
  duration: number; // tính bằng giây

  // Chỉ MỘT trong các trường này sẽ có dữ liệu, 3 trường còn lại sẽ là NULL
  videoContent: LessonVideoDto | null;
  textContent: LessonTextDto | null;
  quizContent: LessonQuizDto | null;
  codingProblem: CodingProblem | null;
}

// --- 3. DTO Khung sườn (Outline) cho Sidebar ---
// (Đây là các interface cũ của bạn, đã đổi tên cho rõ ràng)

/**
 * @description DTO cho một bài học trong sidebar (khung sườn)
 * (Tương ứng với interface 'Lesson' cũ của bạn)
 */
export interface LessonOutline {
  lessonId: string;
  moduleId: string;
  title: string;
  lessonType: "video" | "text" | "quiz" | "coding";
  orderIndex: number;
  isCompleted?: boolean;
}

/**
 * @description DTO cho một Module trong sidebar (khung sườn)
 * (Tương ứng với interface 'Module' cũ của bạn)
 */
export interface ModuleOutline {
  moduleId: string;
  courseId: string;
  title: string;
  orderIndex: number;
  lessons: LessonOutline[]; // Chứa danh sách các bài học (outline)
}
// --- CÁC INTERFACE BẠN ĐÃ CÓ (Đã sửa 1 lỗi) ---

export interface Course {
  courseID: string;
  title: string;
  slug: string;
  thumbnail?: string;
  description?: string;
  level: "beginner" | "intermediate" | "advanced";
  language: string;
  status: string;
  price: number;
  duration: number;
  rating: number;
  totalRatings: number;
  totalStudents: number;
  discount: number;
  badge?: string;
  author: string;
  categoryName: string;
  lessonCount: number;
  isEnrolled: boolean;
  progress: number;
}

export interface Review {
  userId: string;
  username: string; // ⛔️ Đã sửa lỗi typo 'usename'
  avatar: string;
  comment: string;
  rating: number;
  createdAt: string;
}

// -----------------------------------------------------------------
// --- 🆕 CÁC INTERFACE CÒN THIẾU (ĐÃ THÊM) ---
// -----------------------------------------------------------------

// --- 1. DTO cho nội dung chi tiết (Nội dung chính của bài học) ---

/**
 * @description DTO chi tiết cho nội dung bài học VIDEO
 * (Tương ứng với 'videoContent' trong LessonDto)
 */
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
  questionId: string;
  question: string;
  options: string[]; // Mảng các lựa chọn [A, B, C, D]
  explanation: string;
  correctAnswer: number; // Index của câu trả lời đúng (ví dụ: 2)
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

/**
 * @description DTO cho một Test Case của bài code
 */
export interface TestCaseDto {
  testCaseId: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

/**
 * @description DTO chi tiết cho nội dung bài học CODING
 * (Tương ứng với 'codingProblem' trong LessonDto)
 * (Interface 'CodingProblems' cũ của bạn giống như 1 list item, đây là DTO chi tiết)
 */
export interface ProblemDto {
  problemId: string;
  title: string;
  difficulty: string; // "Easy", "Medium", "Hard"
  description: string; // Nội dung đề bài (HTML/Markdown)
  timeLimit: number;
  memoryLimit: number;
  initialCode?: string; // Code mẫu
  solution?: string; // Code giải pháp
  functionName?: string; // Tên hàm cần implement
  testCases: TestCaseDto[];
}

// --- 2. DTO Chi tiết của BÀI HỌC (Lesson) ---

/**
 * @description DTO chi tiết của MỘT BÀI HỌC (trả về từ API /api/lessons/{id})
 * Đây là DTO chính để render nội dung bên phải.
 */
export interface LessonDto {
  lessonId: string;
  moduleId: string;
  title: string;
  lessonType: "video" | "text" | "quiz" | "coding";
  duration: number; // tính bằng giây
  isCompleted: boolean; // ✅ Thêm trường isCompleted để biết bài học đã hoàn thành hay chưa
  // Chỉ MỘT trong các trường này sẽ có dữ liệu, 3 trường còn lại sẽ là NULL
  videoContent: LessonVideoDto | null;
  textContent: LessonTextDto | null;
  quizContent: LessonQuizDto | null;
  codingProblem: ProblemDto | null;
}

// --- 3. DTO Khung sườn (Outline) cho Sidebar ---
// (Đây là các interface cũ của bạn, đã đổi tên cho rõ ràng)

/**
 * @description DTO cho một bài học trong sidebar (khung sườn)
 * (Tương ứng với interface 'Lesson' cũ của bạn)
 */
export interface LessonOutline {
  lessonId: string;
  moduleId: string;
  title: string;
  lessonType: "video" | "text" | "quiz" | "coding";
  orderIndex: number;
  isCompleted?: boolean;
  duration: number; // tính bằng giây
}

/**
 * @description DTO cho một Module trong sidebar (khung sườn)
 * (Tương ứng với interface 'Module' cũ của bạn)
 */
export interface ModuleOutline {
  moduleId: string;
  courseId: string;
  title: string;
  orderIndex: number;
  lessons: LessonOutline[]; // Chứa danh sách các bài học (outline)
}

/**
 * @description DTO chi tiết của KHÓA HỌC (trả về từ API /api/courses/{slug})
 * Dùng để render trang chi tiết khóa học VÀ sidebar của trang học
 * (Tương ứng với interface 'CourseDetail' cũ của bạn)
 */
export interface CourseDetail {
  courseId: string;
  title: string;
  slug: string;
  description: string;
  overview: string | null;
  level: string;
  language: string;
  price: number;
  discount: number;
  duration: number;
  rating: number;
  thumbnail: string;
  totalRatings: number;
  totalStudents: number;
  categoryName: string;
  author: string;
  modules: ModuleOutline[]; // Chứa danh sách Module (outline)
  reviews: Review[];
  isEnrolled: boolean;
  progress: number;
}
export type CourseLevel = "beginner" | "intermediate" | "advanced";
