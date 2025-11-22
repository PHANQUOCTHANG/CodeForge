import {
  useDashboardStats,
  useDashboardData,
} from "@/features/dashboard/hooks";
import { DashboardLayout } from "@/features/dashboard/components";

export default function Dashboard() {
  const { data, isLoading, error } = useDashboardStats();
  console.log("Dashboard data:", data, "Loading:", isLoading, "Error:", error);
  const dashboardData = useDashboardData(data?.data);

  return (
    <DashboardLayout
      stats={dashboardData.stats}
      topCourses={dashboardData.topCourses}
      submissionStatusData={dashboardData.submissionStatusData}
      courseDistributionData={dashboardData.courseDistributionData}
      isLoading={isLoading}
    />
  );
}
