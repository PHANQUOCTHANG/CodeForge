import type { Submission, RecentSubmission } from "@/features/dashboard/types";

/**
 * Chuyển đổi RecentSubmission từ API sang format UI
 */
export const transformSubmissionData = (
  apiData: RecentSubmission
): Submission => {
  return {
    id: parseInt(apiData.id),
    student: apiData.studentName,
    exercise: apiData.exerciseTitle,
    course: apiData.courseTitle,
    status: apiData.status,
    score: apiData.score,
    time: formatTimeAgo(new Date(apiData.submittedAt)),
  };
};

/**
 * Format thời gian theo kiểu "5 phút trước", "1 giờ trước"
 */
export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} giây trước`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} ngày trước`;
};

/**
 * Format số để hiển thị (1,234 thay vì 1234)
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("vi-VN").format(num);
};

/**
 * Tính phần trăm
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Lấy trend string từ giá trị số
 */
export const getTrendString = (
  trendValue: number,
  isPercentage: boolean = true
): string => {
  if (trendValue > 0) {
    return `+${trendValue}${isPercentage ? "%" : ""}`;
  }
  return `${trendValue}${isPercentage ? "%" : ""}`;
};
