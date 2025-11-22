import React from "react";
import { Clock } from "lucide-react";
import type { Submission } from "@/features/dashboard/types";
import "./styles/SubmissionRow.scss";

interface SubmissionRowProps {
  submission: Submission;
  onStatusRender: (status: Submission["status"]) => React.ReactNode;
}

/**
 * Component hiển thị một dòng bài nộp trong bảng
 */
export const SubmissionRow: React.FC<SubmissionRowProps> = ({
  submission,
  onStatusRender,
}) => {
  return (
    <tr className="submission-row">
      <td>
        <div className="submission-row__student">
          <p className="submission-row__name">{submission.student}</p>
          <p className="submission-row__course">{submission.course}</p>
        </div>
      </td>
      <td>{submission.exercise}</td>
      <td>{onStatusRender(submission.status)}</td>
      <td>{submission.score !== null ? `${submission.score}/100` : "-"}</td>
      <td>
        <div className="submission-row__time">
          <Clock size={14} /> {submission.time}
        </div>
      </td>
    </tr>
  );
};

export default SubmissionRow;
