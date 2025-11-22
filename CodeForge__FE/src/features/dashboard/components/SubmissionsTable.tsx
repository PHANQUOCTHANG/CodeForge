import React from "react";
import { SubmissionRow } from "./SubmissionRow";
import type { Submission } from "@/features/dashboard/types";
import "./styles/SubmissionsTable.scss";

interface SubmissionsTableProps {
  submissions: Submission[];
  onViewAll?: () => void;
  isLoading?: boolean;
  onStatusRender: (status: Submission["status"]) => React.ReactNode;
}

/**
 * Component hiển thị bảng bài nộp gần đây
 * Nhận callback onStatusRender từ component cha để hiển thị badge
 */
export const SubmissionsTable: React.FC<SubmissionsTableProps> = ({
  submissions,
  onViewAll,
  isLoading,
  onStatusRender,
}) => {
  if (isLoading) {
    return (
      <div className="submissions-table__loading">Đang tải dữ liệu...</div>
    );
  }

  return (
    <div className="submissions-table">
      <div className="submissions-table__header">
        <h4 className="submissions-table__title">Bài nộp gần đây</h4>
        {onViewAll && (
          <button className="submissions-table__view-all" onClick={onViewAll}>
            Xem tất cả
          </button>
        )}
      </div>

      <div className="submissions-table__wrapper">
        <table className="submissions-table__table">
          <thead>
            <tr>
              <th>Học viên</th>
              <th>Bài tập</th>
              <th>Trạng thái</th>
              <th>Điểm</th>
              <th>Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <SubmissionRow
                key={submission.id}
                submission={submission}
                onStatusRender={onStatusRender}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubmissionsTable;
