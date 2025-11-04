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
  content?: string;
  videoUrl?: string;
  codingProblem?: CodingProblems;
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
  modules: Module[];
  reviews: Review[];
}
