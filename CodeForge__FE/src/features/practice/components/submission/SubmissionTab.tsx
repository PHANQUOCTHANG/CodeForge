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
import "./SubmissionTab.scss";

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
    // Cộng thêm 7 tiếng
    const localDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);

    const now = new Date();
    const diffMs = now.getTime() - localDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;

    return localDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year:
        localDate.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
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
                <span className="metric-value">
                  {submission.memoryUsed / 1000}MB
                </span>
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
                <span>Runtime: {selectedSubmission.executionTime / 1000}s</span>
              </div>
              <div className="stat-item">
                <Database size={16} />
                <span>Memory: {selectedSubmission.memoryUsed / 1000}MB</span>
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
    </div>
  );
};

export default SubmissionsTab;
