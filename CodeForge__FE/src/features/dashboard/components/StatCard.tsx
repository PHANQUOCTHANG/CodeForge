import React from "react";
import { TrendingUp } from "lucide-react";
import type { StatCard as StatCardType } from "@/features/dashboard/types";
import "./styles/StatCard.scss";

interface StatCardProps {
  stat: StatCardType;
}

/**
 * Component hiển thị một card thống kê (tổng học viên, khóa học, bài tập, etc.)
 * Nhận props từ component cha để dễ debug và test
 */
export const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  return (
    <div className="stat-card">
      <div
        className="stat-card__icon"
        style={{
          backgroundColor: `${stat.color}20`,
          color: stat.color,
        }}
      >
        {stat.icon}
      </div>
      <div className="stat-card__info">
        <p className="stat-card__label">{stat.label}</p>
        <p className="stat-card__value">{stat.value}</p>
        <div className="stat-card__trend">
          <TrendingUp size={14} /> <span>{stat.trend}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
