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
export interface CodingProblems {
  problemId: string;
  title: string;
  difficulty: string;
  description: string;
  timeLimit: number;
  memoryLimit: number;
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
