import { CheckCircle2, X } from "lucide-react";
import type { SubmitModalProps } from "../../types";
import "./SubmitModal.scss";

const SubmitModal: React.FC<SubmitModalProps> = ({
  isOpen,
  onClose,
  isSuccess,
  problemTitle,
  passedTests,
  totalTests,
  runtime = "N/A",
  memory = "N/A",
  status,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className={`modal-icon ${isSuccess ? "success" : "failed"}`}>
          {isSuccess ? <CheckCircle2 size={48} /> : <X size={48} />}
        </div>

        <h2 className="modal-title">{status}</h2>

        <p className="modal-subtitle">
          {isSuccess
            ? "Your solution passed all test cases"
            : `${passedTests} out of ${totalTests} test cases passed`}
        </p>

        <div className="modal-problem-title">{problemTitle}</div>

        {isSuccess && (
          <div className="modal-stats">
            <div className="stat-item">
              <span className="stat-label">Runtime</span>
              <span className="stat-value">{runtime}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Memory</span>
              <span className="stat-value">{memory}</span>
            </div>
          </div>
        )}

        <div className="modal-progress">
          <div className="progress-text">
            <span>Test Cases</span>
            <span className={isSuccess ? "text-success" : "text-failed"}>
              {passedTests}/{totalTests}
            </span>
          </div>
          <div className="progress-bar">
            <div
              className={`progress-fill ${isSuccess ? "success" : "failed"}`}
              style={{ width: `${(passedTests / totalTests) * 100}%`}}
            />
          </div>
        </div>

        <button
          className={`modal-button ${isSuccess ? "success" : "failed"}`}
          onClick={onClose}
        >
          {isSuccess ? "Continue" : "Try Again"}
        </button>
      </div>
    </div>
  );
};

export default SubmitModal;
