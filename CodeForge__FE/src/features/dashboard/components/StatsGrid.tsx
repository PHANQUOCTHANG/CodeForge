import React from "react";
import type { StatCard as StatCardType } from "@/features/dashboard/types";
import { StatCard } from "./StatCard";
import "./styles/StatsGrid.scss";

interface StatsGridProps {
  stats: StatCardType[];
  isLoading?: boolean;
}

/**
 * Component hiển thị grid các card thống kê
 * Responsive grid: 1 cột (mobile) -> 2 cột (tablet) -> 4 cột (desktop)
 */
export const StatsGrid: React.FC<StatsGridProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="stats-grid stats-grid--loading">Đang tải dữ liệu...</div>
    );
  }

  return (
    <div className="stats-grid">
      {stats.map((stat, idx) => (
        <StatCard key={idx} stat={stat} />
      ))}
    </div>
  );
};

export default StatsGrid;
