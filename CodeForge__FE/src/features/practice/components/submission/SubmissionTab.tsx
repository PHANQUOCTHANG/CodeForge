import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Database,
  Calendar,
  Eye,
  X,
  Copy,
  Check,
} from "lucide-react";
import practiceService from "../../services/practiceService";

interface SubmissionsTabProps {
  problemId?: string;
  userId?: string;
}

const SubmissionsTab: React.FC<SubmissionsTabProps> = ({
  problemId = "",
  userId = "",
}) => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const response = await practiceService.getSubmissionsById(
          problemId,
          userId
        );
        setSubmissions(response.data.data);
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchSubmissions();
  }, [problemId, userId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Accepted":
        return <CheckCircle className="status-icon accepted" size={18} />;
      case "Wrong Answer":
      case "Runtime Error":
      case "Compilation Error":
        return <XCircle className="status-icon failed" size={18} />;
      case "Time Limit Exceeded":
      case "Memory Limit Exceeded":
        return <Clock className="status-icon warning" size={18} />;
      default:
        return <XCircle className="status-icon" size={18} />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Accepted":
        return "status-accepted";
      case "Wrong Answer":
        return "status-wrong";
      case "Time Limit Exceeded":
      case "Memory Limit Exceeded":
        return "status-tle";
      case "Runtime Error":
      case "Compilation Error":
        return "status-error";
      default:
        return "status-default";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const getLanguageDisplay = (lang: string) => {
    const langMap: { [key: string]: string } = {
      cpp: "C++",
      python: "Python",
      javascript: "JavaScript",
    };
    return langMap[lang] || lang;
  };

  const handleViewCode = (submission: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSubmission(submission);
    setShowCodeModal(true);
    setCopiedCode(false);
  };

  const handleCloseModal = () => {
    setShowCodeModal(false);
    setSelectedSubmission(null);
  };

  const handleCopyCode = async () => {
    if (selectedSubmission?.code) {
      try {
        await navigator.clipboard.writeText(selectedSubmission.code);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      } catch (err) {
        console.error("Failed to copy code:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="submissions-loading">
        <div className="loading-spinner"></div>
        <p>Loading submissions...</p>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="submissions-empty">
        <div className="empty-icon">📝</div>
        <h3>No submissions yet</h3>
        <p>Submit your solution to see your submission history here</p>
      </div>
    );
  }

  return (
    <div className="submissions-container">
      <div className="submissions-header">
        <h2>Your Submissions</h2>
        <span className="submissions-count">{submissions.length} total</span>
      </div>

      <div className="submissions-list">
        {submissions.map((submission) => (
          <div
            key={submission.submissionID}
            className={`submission-card ${getStatusClass(submission.status)}`}
            onClick={() => setSelectedSubmission(submission)}
          >
            <div className="submission-main">
              <div className="submission-status">
                {getStatusIcon(submission.status)}
                <span className="status-text">{submission.status}</span>
              </div>

              <div className="submission-details">
                <div className="detail-item">
                  <Calendar size={14} />
                  <span>{formatDate(submission.submitTime)}</span>
                </div>
                <div className="detail-item">
                  <span className="language-badge">
                    {getLanguageDisplay(submission.language)}
                  </span>
                </div>
              </div>
            </div>

            <div className="submission-metrics">
              <div className="metric">
                <Zap size={14} />
                <span className="metric-label">Runtime</span>
                <span className="metric-value">
                  {submission.executionTime / 1000}ms
                </span>
              </div>
              <div className="metric">
                <Database size={14} />
                <span className="metric-label">Memory</span>
                <span className="metric-value">{submission.memoryUsed / 1000}MB</span>
              </div>
              <div className="metric">
                <CheckCircle size={14} />
                <span className="metric-label">Tests</span>
                <span className="metric-value">
                  {submission.quantityTestPassed}/{submission.quantityTest}
                </span>
              </div>
            </div>

            <div className="submission-actions">
              <button
                className="view-code-btn"
                onClick={(e) => handleViewCode(submission, e)}
              >
                <Eye size={14} />
                View Code
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Code Modal */}
      {showCodeModal && selectedSubmission && (
        <div className="code-modal-overlay" onClick={handleCloseModal}>
          <div className="code-modal" onClick={(e) => e.stopPropagation()}>
            <div className="code-modal-header">
              <div className="code-modal-title">
                <h3>Submission Code</h3>
                <div className="code-modal-meta">
                  <span className="language-badge-large">
                    {getLanguageDisplay(selectedSubmission.language)}
                  </span>
                  <div
                    className={`status-badge ${getStatusClass(
                      selectedSubmission.status
                    )}`}
                  >
                    {getStatusIcon(selectedSubmission.status)}
                    {selectedSubmission.status}
                  </div>
                  <span className="timestamp-badge">
                    {formatDate(selectedSubmission.submitTime)}
                  </span>
                </div>
              </div>
              <div className="code-modal-actions">
                <button
                  className="copy-btn"
                  onClick={handleCopyCode}
                  title="Copy code"
                >
                  {copiedCode ? <Check size={18} /> : <Copy size={18} />}
                  {copiedCode ? "Copied!" : "Copy"}
                </button>
                <button
                  className="close-btn"
                  onClick={handleCloseModal}
                  title="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="code-modal-stats">
              <div className="stat-item">
                <Zap size={16} />
                <span>Runtime: {selectedSubmission.executionTime}ms</span>
              </div>
              <div className="stat-item">
                <Database size={16} />
                <span>Memory: {selectedSubmission.memoryUsed}MB</span>
              </div>
              <div className="stat-item">
                <CheckCircle size={16} />
                <span>
                  Tests: {selectedSubmission.quantityTestPassed}/
                  {selectedSubmission.quantityTest}
                </span>
              </div>
            </div>

            <div className="code-modal-body">
              <pre className="code-content">
                <code>{selectedSubmission.code}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .submissions-container {
          color: #e4e4e7;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .submissions-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #27272a;
        }

        .submissions-header h2 {
          font-size: 22px;
          font-weight: 700;
          color: #fafafa;
          margin: 0;
        }

        .submissions-count {
          font-size: 13px;
          color: #71717a;
          background: #18181b;
          padding: 6px 12px;
          border-radius: 12px;
          border: 1px solid #27272a;
        }

        .submissions-loading,
        .submissions-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          color: #71717a;
        }

        .loading-spinner {
          border: 3px solid #27272a;
          border-top: 3px solid #3b82f6;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 0.8s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 16px;
          opacity: 0.6;
        }

        .submissions-empty h3 {
          font-size: 18px;
          color: #e4e4e7;
          margin: 0 0 8px 0;
        }

        .submissions-empty p {
          font-size: 14px;
          color: #71717a;
          margin: 0;
        }

        .submissions-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .submission-card {
          background: #18181b;
          border: 1.5px solid #27272a;
          border-radius: 12px;
          padding: 18px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .submission-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          transition: all 0.2s ease;
        }

        .submission-card.status-accepted::before {
          background: #22c55e;
        }

        .submission-card.status-wrong::before {
          background: #ef4444;
        }

        .submission-card.status-tle::before {
          background: #f59e0b;
        }

        .submission-card.status-error::before {
          background: #dc2626;
        }

        .submission-card:hover {
          border-color: #3f3f46;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .submission-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .submission-status {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .status-icon {
          flex-shrink: 0;
        }

        .status-icon.accepted {
          color: #22c55e;
        }

        .status-icon.failed {
          color: #ef4444;
        }

        .status-icon.warning {
          color: #f59e0b;
        }

        .status-text {
          font-size: 15px;
          font-weight: 600;
          color: #e4e4e7;
        }

        .submission-details {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #a1a1aa;
        }

        .language-badge {
          background: #27272a;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #3b82f6;
          border: 1px solid #3f3f46;
        }

        .submission-metrics {
          display: flex;
          gap: 24px;
          padding: 12px 0;
          border-top: 1px solid #27272a;
          border-bottom: 1px solid #27272a;
        }

        .metric {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #71717a;
          font-size: 13px;
        }

        .metric svg {
          color: #3b82f6;
        }

        .metric-label {
          color: #a1a1aa;
          font-weight: 500;
        }

        .metric-value {
          color: #e4e4e7;
          font-weight: 600;
          font-family: 'Monaco', 'Menlo', monospace;
        }

        .submission-actions {
          margin-top: 12px;
          display: flex;
          justify-content: flex-end;
        }

        .view-code-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: #27272a;
          border: 1px solid #3f3f46;
          border-radius: 6px;
          color: #e4e4e7;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .view-code-btn:hover {
          background: #3f3f46;
          border-color: #52525b;
          transform: translateX(-2px);
        }

        /* Code Modal Styles */
        .code-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease;
          padding: 20px;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .code-modal {
          background: #0a0a0a;
          border: 1px solid #27272a;
          border-radius: 16px;
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .code-modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid #27272a;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          background: linear-gradient(180deg, #18181b 0%, #0a0a0a 100%);
          border-radius: 16px 16px 0 0;
        }

        .code-modal-title h3 {
          margin: 0 0 12px 0;
          font-size: 20px;
          font-weight: 700;
          color: #fafafa;
        }

        .code-modal-meta {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .language-badge-large {
          background: #27272a;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #3b82f6;
          border: 1px solid #3f3f46;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          border: 1px solid;
        }

        .status-badge.status-accepted {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
          border-color: #22c55e;
        }

        .status-badge.status-wrong {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border-color: #ef4444;
        }

        .status-badge.status-tle {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
          border-color: #f59e0b;
        }

        .status-badge.status-error {
          background: rgba(220, 38, 38, 0.1);
          color: #dc2626;
          border-color: #dc2626;
        }

        .timestamp-badge {
          font-size: 13px;
          color: #71717a;
          padding: 6px 12px;
          background: #18181b;
          border-radius: 8px;
          border: 1px solid #27272a;
        }

        .code-modal-actions {
          display: flex;
          gap: 8px;
        }

        .copy-btn,
        .close-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border: 1px solid #27272a;
          border-radius: 8px;
          background: #18181b;
          color: #e4e4e7;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .copy-btn:hover,
        .close-btn:hover {
          background: #27272a;
          border-color: #3f3f46;
        }

        .copy-btn:active {
          transform: scale(0.95);
        }

        .close-btn {
          padding: 8px 10px;
        }

        .code-modal-stats {
          display: flex;
          gap: 24px;
          padding: 16px 24px;
          background: #18181b;
          border-bottom: 1px solid #27272a;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #a1a1aa;
        }

        .stat-item svg {
          color: #3b82f6;
        }

        .stat-item span {
          color: #e4e4e7;
          font-weight: 600;
        }

        .code-modal-body {
          flex: 1;
          overflow: auto;
          padding: 24px;
        }

        .code-modal-body::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }

        .code-modal-body::-webkit-scrollbar-track {
          background: #0a0a0a;
        }

        .code-modal-body::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 5px;
        }

        .code-modal-body::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }

        .code-content {
          background: #18181b;
          border: 1px solid #27272a;
          border-radius: 12px;
          padding: 20px;
          margin: 0;
          font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
          font-size: 14px;
          line-height: 1.6;
          color: #e4e4e7;
          overflow-x: auto;
          white-space: pre;
        }

        .code-content code {
          display: block;
          color: #e4e4e7;
        }

        @media (max-width: 768px) {
          .submissions-header h2 {
            font-size: 18px;
          }

          .submission-main {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .submission-metrics {
            flex-wrap: wrap;
            gap: 16px;
          }

          .metric {
            flex: 1;
            min-width: 100px;
          }

          .code-modal {
            max-width: 100%;
            max-height: 95vh;
            margin: 10px;
          }

          .code-modal-header {
            flex-direction: column;
            gap: 16px;
          }

          .code-modal-actions {
            width: 100%;
            justify-content: flex-end;
          }

          .code-modal-stats {
            flex-wrap: wrap;
            gap: 16px;
          }

          .code-content {
            font-size: 13px;
            padding: 16px;
          }
        }

        @media (max-width: 480px) {
          .submission-card {
            padding: 14px;
          }

          .submission-details {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .submission-metrics {
            flex-direction: column;
            gap: 12px;
          }

          .metric {
            min-width: unset;
          }

          .code-modal-overlay {
            padding: 10px;
          }

          .code-modal {
            border-radius: 12px;
          }

          .code-modal-header {
            padding: 16px;
          }

          .code-modal-title h3 {
            font-size: 18px;
          }

          .code-modal-meta {
            gap: 8px;
          }

          .code-modal-stats {
            flex-direction: column;
            gap: 12px;
            padding: 12px 16px;
          }

          .code-modal-body {
            padding: 16px;
          }

          .code-content {
            font-size: 12px;
            padding: 12px;
          }

          .copy-btn,
          .close-btn {
            padding: 6px 10px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default SubmissionsTab;
