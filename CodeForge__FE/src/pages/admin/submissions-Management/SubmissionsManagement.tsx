import React, { useState, useEffect } from "react";
import "./SubmissionsManagement.scss";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaCodeBranch,
  FaEllipsisV,
  FaEye,
  FaTrash,
  FaDownload,
  FaTimes,
  FaCopy,
  FaCheck,
} from "react-icons/fa";
import practiceService from "@/features/practice/services/practiceService";

interface Submission {
  submissionId: string;
  userName: string;
  userEmail: string;
  problemTitle: string;
  problemSlug: string;
  language: string;
  status:
    | "Accepted"
    | "Wrong Answer"
    | "Runtime Error"
    | "Time Limit"
    | "Pending";
  submitTime: string;
  executionTime: number;
  memoryUsed: number;
  quantityTestPassed: number;
  quantityTest: number;
  difficulty: string;
  code?: string;
}

// Data structure for API response
interface SubmissionDetailData {
  submissionId: string;
  userId: string;
  problemId: string;
  code: string;
  language: string;
  status: string;
  submitTime: string;
  executionTime: number;
  memoryUsed: number;
  quantityTestPassed: number;
  quantityTest: number;
  testCaseIdFail: string | null;
  user: {
    userId: string;
    username: string;
    email: string;
    role: string;
    joinDate: string;
    status: string;
  };
  problem: {
    problemId: string;
    title: string;
    slug: string;
    difficulty: string;
    description: string;
    tags: string;
    functionName: string;
    parameters: string;
    returnType: string;
    notes: string;
    constraints: string;
    timeLimit: number;
    memoryLimit: number;
    createdAt: string;
    updatedAt: string;
    lessonId: string | null;
  };
}

const SubmissionsManagement: React.FC = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [difficultyFilter, setDifficultyFilter] = useState("Tất cả");
  const [languageFilter, setLanguageFilter] = useState("Tất cả");
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);
  const [openAction, setOpenAction] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "problemName">(
    "latest"
  );
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [viewingSubmission, setViewingSubmission] = useState<Submission | null>(null);
  const [copied, setCopied] = useState(false);
  const [loadingCode, setLoadingCode] = useState(false);

  const pageSize = 10;

  // Filter logic
  const filtered = submissions.filter((submission) => {
    const matchSearch =
      submission.userName.toLowerCase().includes(search.toLowerCase()) ||
      submission.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      submission.problemTitle.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "Tất cả" ? true : submission.status === statusFilter;
    const matchDifficulty =
      difficultyFilter === "Tất cả"
        ? true
        : submission.difficulty === difficultyFilter;
    const matchLanguage =
      languageFilter === "Tất cả"
        ? true
        : submission.language === languageFilter;

    return matchSearch && matchStatus && matchDifficulty && matchLanguage;
  });

  // Sorting logic
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "latest") {
      return (
        new Date(b.submitTime).getTime() - new Date(a.submitTime).getTime()
      );
    } else if (sortBy === "oldest") {
      return (
        new Date(a.submitTime).getTime() - new Date(b.submitTime).getTime()
      );
    } else {
      return a.problemTitle.localeCompare(b.problemTitle);
    }
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = sorted.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Pagination validation
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        // Block 1: Try to fetch with details (includes user and problem info)
        {
          try {
            const submissionData = await practiceService.getAllSubmission();

            // Transform API data to match Submission interface
            const transformedData: Submission[] = submissionData.map(
              (item: SubmissionDetailData) => ({
                submissionId: item.submissionId,
                userName: item.user?.username || "Unknown",
                userEmail: item.user?.email || "Unknown",
                problemTitle: item.problem?.title || "Unknown",
                problemSlug: item.problem?.slug || "unknown",
                language: item.language,
                status: item.status as Submission["status"],
                submitTime: new Date(item.submitTime).toLocaleString("vi-VN"),
                executionTime: item.executionTime || 0,
                memoryUsed: item.memoryUsed || 0,
                quantityTestPassed: item.quantityTestPassed || 0,
                quantityTest: item.quantityTest || 0,
                difficulty: item.problem?.difficulty || "Unknown",
                code: item.code || "",
              })
            );

            setSubmissions(transformedData);
            return; // Success - exit the effect
          } catch (detailsError) {
            console.warn(
              "⚠️ Endpoint with-details không khả dụng:",
              detailsError
            );
            // Continue to fallback block
          }
        }

        // Block 2: Fallback to getAllSubmission if with-details endpoint doesn't exist
        {
          try {
            const fallbackData = await practiceService.getAllSubmission();
            setSubmissions(fallbackData || []);
          } catch (fallbackError) {
            console.error("❌ Lỗi khi lấy dữ liệu submission:", fallbackError);
            setSubmissions([]);
          }
        }
      } catch (error) {
        // Outer catch for any unexpected errors
        console.error("❌ Lỗi không mong muốn:", error);
        setSubmissions([]);
      }
    };

    fetchSubmissions();
  }, []);

  const isPageFullySelected =
    paginated.length > 0 &&
    paginated.every((s) => selectedSubmissions.includes(s.submissionId));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSubmissions((prev) => {
        const setPrev = new Set(prev);
        paginated.forEach((s) => setPrev.add(s.submissionId));
        return Array.from(setPrev);
      });
    } else {
      setSelectedSubmissions((prev) =>
        prev.filter((id) => !paginated.some((s) => s.submissionId === id))
      );
    }
  };

  const handleSelectSubmission = (submissionId: string) => {
    setSelectedSubmissions((prev) =>
      prev.includes(submissionId)
        ? prev.filter((id) => id !== submissionId)
        : [...prev, submissionId]
    );
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, difficultyFilter, languageFilter, sortBy]);

  const handleViewCode = async (submission: Submission) => {
    setOpenAction(null);
    setLoadingCode(true);
    
    try {
      // If code is already loaded, just show it
      if (submission.code) {
        setViewingSubmission(submission);
      } else {
        // Fetch full submission details with code
        const fullSubmission = await practiceService.getSubmissionById(submission.submissionId);
        setViewingSubmission({
          ...submission,
          code: fullSubmission.code || "// Code not available",
        });
      }
    } catch (error) {
      console.error("Error loading submission code:", error);
      alert("Không thể tải code. Vui lòng thử lại.");
    } finally {
      setLoadingCode(false);
    }
  };

  const handleCopyCode = () => {
    if (viewingSubmission?.code) {
      navigator.clipboard.writeText(viewingSubmission.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadCode = (submission: Submission) => {
    const extension: Record<string, string> = {
      JavaScript: "js",
      Python: "py",
      Java: "java",
      "C++": "cpp",
    };

    const ext = extension[submission.language] || "txt";
    const code = submission.code || "// Code not available";
    
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${submission.problemSlug}_${submission.submissionId}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Accepted":
        return <FaCheckCircle className="status-icon accepted" />;
      case "Wrong Answer":
        return <FaTimesCircle className="status-icon wrong" />;
      case "Time Limit":
        return <FaClock className="status-icon timeout" />;
      case "Runtime Error":
        return <FaTimesCircle className="status-icon error" />;
      case "Pending":
        return <FaCodeBranch className="status-icon pending" />;
      default:
        return null;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Accepted":
        return "badge-success";
      case "Wrong Answer":
        return "badge-danger";
      case "Time Limit":
        return "badge-warning";
      case "Runtime Error":
        return "badge-error";
      case "Pending":
        return "badge-info";
      default:
        return "";
    }
  };

  const getDifficultyBadgeClass = (difficulty: string) => {
    switch (difficulty) {
      case "Dễ":
        return "difficulty-easy";
      case "Trung bình":
        return "difficulty-medium";
      case "Khó":
        return "difficulty-hard";
      default:
        return "";
    }
  };

  return (
    <div className="submissions-page">
      <h2>Submissions Management</h2>

      {/* ===== Search ===== */}
      <div className="search-row">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ===== Filters + Actions ===== */}
      <div className="filter-bar">
        <div className="filter-group">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>Tất cả trạng thái</option>
            <option>Accepted</option>
            <option>Wrong Answer</option>
            <option>Time Limit</option>
            <option>Runtime Error</option>
            <option>Pending</option>
          </select>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <option>Tất cả độ khó</option>
            <option>Dễ</option>
            <option>Trung bình</option>
            <option>Khó</option>
          </select>
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
          >
            <option>Tất cả ngôn ngữ</option>
            <option>JavaScript</option>
            <option>Python</option>
            <option>Java</option>
            <option>C++</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "latest" | "oldest" | "problemName")
            }
          >
            <option value="latest">Mới nhất trước</option>
            <option value="oldest">Cũ nhất trước</option>
            <option value="problemName">Tên bài toán</option>
          </select>
        </div>

        {selectedSubmissions.length > 0 && (
          <div className="action-buttons">
            <button className="btn-delete">
              <FaTrash /> Xóa ({selectedSubmissions.length})
            </button>
            <button className="btn-export">
              <FaDownload /> Export
            </button>
          </div>
        )}
      </div>

      {/* ===== Table ===== */}
      <div className="table-container">
        <table className="submissions-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={isPageFullySelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th>User</th>
              <th>Bài toán</th>
              <th>Ngôn ngữ</th>
              <th>Trạng thái</th>
              <th>Thời gian (ms)</th>
              <th>Bộ nhớ (KB)</th>
              <th>Test</th>
              <th>Thời gian nộp</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((submission) => (
              <tr key={submission.submissionId} className="table-row">
                <td className="checkbox-cell">
                  <input
                    type="checkbox"
                    checked={selectedSubmissions.includes(
                      submission.submissionId
                    )}
                    onChange={() =>
                      handleSelectSubmission(submission.submissionId)
                    }
                  />
                </td>
                <td className="user-cell">
                  <div className="user-info">
                    <div className="avatar">
                      {submission.userName.charAt(0)}
                    </div>
                    <div className="user-details">
                      <p className="user-name">{submission.userName}</p>
                      <p className="user-email">{submission.userEmail}</p>
                    </div>
                  </div>
                </td>
                <td className="problem-cell">
                  <div className="problem-info">
                    <p className="problem-title">{submission.problemTitle}</p>
                    <span
                      className={`difficulty-badge ${getDifficultyBadgeClass(
                        submission.difficulty
                      )}`}
                    >
                      {submission.difficulty}
                    </span>
                  </div>
                </td>
                <td className="language-cell">
                  <span className="language-badge">{submission.language}</span>
                </td>
                <td className="status-cell">
                  <div className="status-wrapper">
                    <span
                      className={`status-badge ${getStatusBadgeClass(
                        submission.status
                      )}`}
                    >
                      {submission.status}
                    </span>
                  </div>
                </td>
                <td className="metric-cell">
                  <span>{submission.executionTime}</span>
                </td>
                <td className="metric-cell">
                  <span>{submission.memoryUsed}</span>
                </td>
                <td className="test-cell">
                  <div className="test-progress">
                    <span className="test-count">
                      {submission.quantityTestPassed}/{submission.quantityTest}
                    </span>
                    <div className="test-bar">
                      <div
                        className="test-bar-fill"
                        style={{
                          width: `${
                            (submission.quantityTestPassed /
                              submission.quantityTest) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="time-cell">
                  <span className="submit-time">{submission.submitTime}</span>
                </td>
                <td className="action-cell">
                  <div className="action-menu">
                    <button
                      className="action-btn"
                      onClick={() =>
                        setOpenAction(
                          openAction === submission.submissionId
                            ? null
                            : submission.submissionId
                        )
                      }
                    >
                      <FaEllipsisV />
                    </button>
                    {openAction === submission.submissionId && (
                      <div className="dropdown-menu">
                        <button 
                          className="menu-item view"
                          onClick={() => handleViewCode(submission)}
                        >
                          <FaEye /> Xem chi tiết
                        </button>
                        <button 
                          className="menu-item download"
                          onClick={() => handleDownloadCode(submission)}
                        >
                          <FaDownload /> Tải code
                        </button>
                        <button className="menu-item delete">
                          <FaTrash /> Xóa
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {paginated.length === 0 && (
        <div className="empty-state">
          <p>Không tìm thấy submission nào</p>
        </div>
      )}

      {/* ===== Pagination ===== */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="btn-nav"
          >
            ← Trước
          </button>

          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`page-btn ${currentPage === page ? "active" : ""}`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="btn-nav"
          >
            Tiếp →
          </button>
        </div>
      )}

      {/* ===== Code Viewer Modal ===== */}
      {viewingSubmission && (
        <div className="modal-overlay" onClick={() => setViewingSubmission(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <h3 className="modal-title">Chi tiết Submission</h3>
                <p className="modal-subtitle">
                  {viewingSubmission.problemTitle} - {viewingSubmission.userName}
                </p>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setViewingSubmission(null)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="modal-body">
              {/* Submission Info */}
              <div className="submission-info-grid">
                <div className="info-item">
                  <span className="info-label">Trạng thái:</span>
                  <span className={`status-badge ${getStatusBadgeClass(viewingSubmission.status)}`}>
                    {viewingSubmission.status}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Ngôn ngữ:</span>
                  <span className="language-badge">{viewingSubmission.language}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Thời gian thực thi:</span>
                  <span>{viewingSubmission.executionTime} ms</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Bộ nhớ:</span>
                  <span>{viewingSubmission.memoryUsed} KB</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Test cases:</span>
                  <span>
                    {viewingSubmission.quantityTestPassed}/{viewingSubmission.quantityTest} passed
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Thời gian nộp:</span>
                  <span>{viewingSubmission.submitTime}</span>
                </div>
              </div>

              {/* Code Section */}
              <div className="code-section">
                <div className="code-header">
                  <span className="code-title">Code</span>
                  <div className="code-actions">
                    <button className="code-action-btn" onClick={handleCopyCode}>
                      {copied ? <FaCheck /> : <FaCopy />}
                      <span>{copied ? "Đã copy" : "Copy"}</span>
                    </button>
                    <button 
                      className="code-action-btn"
                      onClick={() => handleDownloadCode(viewingSubmission)}
                    >
                      <FaDownload />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
                <div className="code-viewer">
                  {loadingCode ? (
                    <div className="code-loading">Đang tải code...</div>
                  ) : (
                    <pre className="code-block">
                      <code>{viewingSubmission.code || "// Code not available"}</code>
                    </pre>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionsManagement;