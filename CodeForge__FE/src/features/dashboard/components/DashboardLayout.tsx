import React from "react";
import { StatsGrid } from "./StatsGrid";
import { ChartCard } from "./ChartCard";
import { SubmissionsSection } from "./SubmissionsSection";
import type {
  StatCard as StatCardType,
  PieChartData,
  Course,
} from "@/features/dashboard/types";
import "./styles/DashboardLayout.scss";

interface DashboardLayoutProps {
  stats: StatCardType[];
  submissionStatusData: PieChartData[];
  courseDistributionData: PieChartData[];
  topCourses: Course[];
  isLoading?: boolean;
}

/**
 * Component chính của Dashboard
 * Tập hợp tất cả các sub-components và quản lý layout
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  stats,
  submissionStatusData,
  courseDistributionData,
  topCourses,
  isLoading,
}) => {
  return (
    <div className="dashboard-layout">
      {/* Stats Cards */}
      <StatsGrid stats={stats} isLoading={isLoading} />

      {/* Charts Section */}
      <div className="dashboard-layout__charts">
        <ChartCard
          title="Phân bố trạng thái bài nộp"
          data={submissionStatusData}
          isLoading={isLoading}
        />
        <ChartCard
          title="Phân bố học viên theo khóa học"
          data={courseDistributionData}
          isLoading={isLoading}
        />
      </div>

      {/* Top Courses */}
      <SubmissionsSection topCourses={topCourses} isLoading={isLoading} />
    </div>
  );
};

export default DashboardLayout;
