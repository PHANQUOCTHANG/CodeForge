import type { ModuleDto, UpdateModuleDto } from "@/features/module/types";
import type { TestCase } from "@/features/practice/types";

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

export interface Course {
  courseId: string;
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
export interface CourseDto {
  courseId: string;
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
export interface CreateCourseDto {
  courseId: string;
  title: string;
  slug: string;
  thumbnail?: string | (string & File) | undefined;
  description?: string;
  level: "beginner" | "intermediate" | "advanced";
  language: string;
  status: string;
  price: number;
  duration: number;
  overview?: string;
  rating: number;
  totalRatings: number;
  totalStudents: number;
  discount: number;
  createdBy: string;
  lessonCount: number;
  modules: ModuleDto[];
}
export interface UpdateCourseDto {
  courseId: string;
  title: string;
  slug: string;
  thumbnail?: string | (string & File) | undefined | null;
  description?: string;
  level: "beginner" | "intermediate" | "advanced";
  language: string;
  status: string;
  price: number;
  duration: number;
  overview?: string;
  rating: number;
  totalRatings: number;
  totalStudents: number;
  discount: number;
  createdBy: string;
  lessonCount: number;
  modules: UpdateModuleDto[];
}

export interface Review {
  userId: string;
  username: string; // ⛔️ Đã sửa lỗi typo 'usename'
  avatar: string;
  comment: string;
  rating: number;
  createdAt: string;
}

export interface TestCaseDto {
  testCaseId: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface CourseDetail {
  courseId: string;
  title: string;
  categoryId: string;
  slug: string;
  description: string | null;
  overview: string | null;
  level: "beginner" | "intermediate" | "advanced";
  language: string;
  price: number;
  discount: number;
  duration: number;
  rating: number;
  thumbnail: string | (string & File) | undefined;
  totalRatings: number;
  totalStudents: number;
  categoryName: string;
  author: string;
  modules: ModuleDto[]; // Chứa danh sách Module (outline)
  reviews: Review[];
  isEnrolled: boolean;
  progress: number;
  status: string;
  lessonCount: number;
}
export type CourseLevel = "beginner" | "intermediate" | "advanced";
