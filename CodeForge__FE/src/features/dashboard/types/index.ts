// Dashboard Statistics Types
export interface StatCard {
  label: string;
  value: string;
  trend: string;
  color: string;
  icon?: React.ReactNode;
}

export interface Submission {
  id: number;
  student: string;
  exercise: string;
  course: string;
  status: "passed" | "failed" | "pending";
  score: number | null;
  time: string;
}

export interface Course {
  name: string;
  students: number;
  completion: number;
}

export interface PieChartData {
  name: string;
  value: number;
  color: string;
}

// API Response Types - Matching backend DashboardStatsDto
export interface DashboardSummary {
  totalStudents: number;
  totalCourses: number;
  totalRevenue: number;
  totalSubmissions: number;
}

export interface RevenueChart {
  date: string; // "MM/yyyy" format
  amount: number;
}

export interface NewUserChart {
  date: string;
  count: number;
}

export interface TopCourseDto {
  courseId: string;
  title: string;
  thumbnail: string;
  totalStudents: number;
  revenue: number;
}

export interface SubmissionStats {
  total: number;
  solved: number;
  failed: number;
  passRate: number; // Percentage (0-100)
}

export interface AdminDashboardData {
  summary: DashboardSummary;
  revenueChart: RevenueChart[];
  newUserChart: NewUserChart[];
  topCourses: TopCourseDto[];
  submissionStats: SubmissionStats;
}
