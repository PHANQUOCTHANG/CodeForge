import { useMemo } from "react";
import type {
  StatCard as StatCardType,
  PieChartData,
  Course,
} from "@/features/dashboard/types";
import { formatNumber } from "@/features/dashboard/utils/dashboardUtils";
import type { AdminDashboardData } from "@/features/dashboard/types";

/**
 * Hook xử lý logic chuyển đổi dữ liệu API thành format UI
 * Tách riêng logic để Dashboard.tsx chỉ hiển thị
 */
export const useDashboardData = (data: AdminDashboardData | undefined) => {
  console.log("useDashboardData received data:", data);

  const stats = useMemo((): StatCardType[] => {
    if (!data?.summary) return [];

    return [
      {
        label: "Tổng học viên",
        value: formatNumber(data.summary.totalStudents),
        trend: "+0%",
        color: "#3b82f6",
        icon: undefined,
      },
      {
        label: "Khóa học",
        value: formatNumber(data.summary.totalCourses),
        trend: "+0%",
        color: "#10b981",
        icon: undefined,
      },
      {
        label: "Doanh thu",
        value: `$${formatNumber(Math.floor(data.summary.totalRevenue))}`,
        trend: "+0%",
        color: "#8b5cf6",
        icon: undefined,
      },
      {
        label: "Bài tập nộp",
        value: formatNumber(data.summary.totalSubmissions),
        trend: "+0%",
        color: "#f59e0b",
        icon: undefined,
      },
    ];
  }, [data?.summary]);

  const topCourses = useMemo((): Course[] => {
    if (!data?.topCourses) return [];
    return data.topCourses.map((course) => ({
      name: course.title,
      students: course.totalStudents,
      completion: (course.revenue / (data.summary?.totalRevenue || 1)) * 100, // Use revenue as proxy
    }));
  }, [data?.topCourses, data?.summary?.totalRevenue]);

  // Convert submission stats to pie chart data
  const submissionStatusData = useMemo((): PieChartData[] => {
    if (!data?.submissionStats) return [];

    return [
      {
        name: "Đã giải",
        value: data.submissionStats.solved,
        color: "#10b981",
      },
      {
        name: "Chưa giải",
        value: data.submissionStats.failed,
        color: "#ef4444",
      },
    ];
  }, [data?.submissionStats]);

  // Convert new user chart to course distribution data
  const courseDistributionData = useMemo((): PieChartData[] => {
    if (!data?.newUserChart || data.newUserChart.length === 0) return [];

    return data.newUserChart.map((item) => ({
      name: item.date,
      value: item.count,
      color: "#3b82f6",
    }));
  }, [data?.newUserChart]);

  return {
    stats,
    topCourses,
    submissionStatusData,
    courseDistributionData,
  };
};
