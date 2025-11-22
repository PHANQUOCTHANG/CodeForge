import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import type { PieChartData } from "@/features/dashboard/types";
import "./styles/ChartCard.scss";

interface ChartCardProps {
  title: string;
  data: PieChartData[];
  isLoading?: boolean;
}

/**
 * Component hiển thị biểu đồ Pie Chart
 * Nhận dữ liệu qua props để linh hoạt và tái sử dụng
 */
export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  data,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="chart-card">
        <h3 className="chart-card__title">{title}</h3>
        <div className="chart-card__chart chart-card__chart--loading">
          Đang tải...
        </div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h3 className="chart-card__title">{title}</h3>
      <div className="chart-card__chart">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(props: any) =>
                `${props.name} ${(props.percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              dataKey="value"
            >
              {data.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartCard;
