import React, { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { Pagination } from "antd";
import "./PageProblem.scss";
import { useNavigate, useSearchParams } from "react-router-dom";
import practiceService from "@/features/practice/services/practiceService";
import { openNotification } from "@/common/helper/notification";

interface CodingProblem {
  problemId: string;
  lessonId: string | null;
  title: string;
  slug: string;
  description: string | null;
  difficulty: string; // "Easy", "Medium", "Hard"
  tags: string | null;
  functionName: string | null;
  parameters: string | null;
  returnType: string | null;
  notes: string | null;
  constraints: string | null;
  status: string; // "NOT_STARTED", "ATTEMPTED", "SOLVED"
  timeLimit: number;
  memoryLimit: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

interface Stat {
  label: string;
  value: number;
}

const ProblemManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [problems, setProblems] = useState<CodingProblem[]>([]);

  // Lấy các tham số từ URL
  const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
  const difficultyFromUrl = searchParams.get("difficulty") || "all";
  const searchFromUrl = searchParams.get("search") || "";

  const [search, setSearch] = useState<string>(searchFromUrl);
  const [filterDifficulty, setFilterDifficulty] =
    useState<string>(difficultyFromUrl);
  const [currentPage, setCurrentPage] = useState<number>(pageFromUrl);
  const PAGE_SIZE = 10;

  // Tải danh sách bài tập khi component được mount
  useEffect(() => {
    const loadProblems = async () => {
      try {
        const data = await practiceService.getAllProblem();
        setProblems(data);
      } catch (error) {
        console.error("Failed to load problems:", error);
        openNotification("error", "Lỗi khi tải danh sách bài tập", "");
      }
    };

    loadProblems();
  }, []);

  // Lọc bài tập theo tìm kiếm và độ khó
  const filtered = problems.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.tags || "").toLowerCase().includes(search.toLowerCase());
    const matchDifficulty =
      filterDifficulty === "all" || p.difficulty === filterDifficulty;
    return matchSearch && matchDifficulty;
  });

  // Cập nhật các tham số URL
  const updateUrlParams = (
    page: number,
    difficulty: string,
    searchTerm: string
  ) => {
    const params = new URLSearchParams();
    if (page > 1) params.append("page", page.toString());
    if (difficulty !== "all") params.append("difficulty", difficulty);
    if (searchTerm) params.append("search", searchTerm);

    const queryString = params.toString();
    navigate(`?${queryString}`, { replace: true });
  };

  // Xử lý thay đổi trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrlParams(page, filterDifficulty, search);
  };

  // Xử lý thay đổi tìm kiếm
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1); // Quay lại trang 1 khi tìm kiếm
    updateUrlParams(1, filterDifficulty, value);
  };

  // Xử lý thay đổi bộ lọc độ khó
  const handleDifficultyChange = (value: string) => {
    setFilterDifficulty(value);
    setCurrentPage(1); // Quay lại trang 1 khi lọc
    updateUrlParams(1, value, search);
  };

  // Phân trang kết quả đã lọc
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Lấy modifier CSS cho badge độ khó
  const getDifficultyModifier = (diff: string): string => {
    const modifiers: Record<string, string> = {
      Easy: "problem-management__difficulty-badge--easy",
      Medium: "problem-management__difficulty-badge--medium",
      Hard: "problem-management__difficulty-badge--hard",
    };
    return modifiers[diff] ?? "";
  };

  // Tính toán thống kê
  const stats: Stat[] = [
    { label: "Tổng Bài Tập", value: problems.length },
    {
      label: "Dễ",
      value: problems.filter((p) => p.difficulty === "Dễ").length,
    },
    {
      label: "Trung Bình",
      value: problems.filter((p) => p.difficulty === "Trung Bình").length,
    },
    {
      label: "Khó",
      value: problems.filter((p) => p.difficulty === "Khó").length,
    },
  ];

  // Xử lý thêm bài tập mới
  const handleAdd = () => {
    localStorage.removeItem("codingProblemDraft");
    navigate("create");
  };

  // Xử lý chỉnh sửa bài tập
  const handleEdit = (problem) => {
    navigate(`edit/${problem.slug}`);
  };

  // Xử lý xóa bài tập
  const handleDelete = async (problemId: string) => {
    if (!confirm("Bạn có chắc muốn xóa không?")) {
      return;
    }

    try {
      await practiceService.deleteProblem(problemId);
      openNotification("success", "Xóa bài tập thành công", "");
      // Cập nhật danh sách sau khi xóa
      setProblems((prev) => prev.filter((p) => p.problemId !== problemId));
    } catch (error) {
      console.error("Failed to delete problem:", error);
      openNotification("error", "Lỗi khi xóa bài tập", "");
    }
  };

  return (
    <div className="problem-management">
      {/* Header */}
      <div className="problem-management__header">
        <div className="problem-management__header-content">
          <div className="problem-management__header-wrapper">
            <div>
              <h1 className="problem-management__title">Quản Lý Bài Tập</h1>
              <p className="problem-management__subtitle">
                Quản lý các bài tập lập trình của bạn
              </p>
            </div>
            <button
              className="problem-management__add-button"
              onClick={handleAdd}
            >
              <Plus size={18} />
              Thêm Bài Tập
            </button>
          </div>
        </div>
      </div>

      <div className="problem-management__content">
        {/* Stats */}
        <div className="problem-management__stats">
          {stats.map((stat, idx) => (
            <div key={idx} className="problem-management__stat-card">
              <div className="problem-management__stat-label">{stat.label}</div>
              <div className="problem-management__stat-value">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="problem-management__controls">
          <div className="problem-management__search-wrapper">
            <Search className="problem-management__search-icon" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm bài tập..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="problem-management__search-input"
            />
          </div>
          <select
            value={filterDifficulty}
            onChange={(e) => handleDifficultyChange(e.target.value)}
            className="problem-management__filter-select"
          >
            <option value="all">Tất Cả Mức Độ</option>
            <option value="Easy">Dễ</option>
            <option value="Medium">Trung Bình</option>
            <option value="Hard">Khó</option>
          </select>
        </div>

        {/* Table */}
        <div className="problem-management__table-wrapper">
          <table className="problem-management__table">
            <thead className="problem-management__table-head">
              <tr>
                <th className="problem-management__table-header">Bài Tập</th>
                <th className="problem-management__table-header">Độ Khó</th>
                <th className="problem-management__table-header">Thẻ</th>
                <th className="problem-management__table-header">
                  Giới Hạn Thời Gian
                </th>
                <th className="problem-management__table-header">
                  Giới Hạn Bộ Nhớ
                </th>
                <th className="problem-management__table-header">Ngày Tạo</th>
                <th className="problem-management__table-header problem-management__table-header--right">
                  Hành Động
                </th>
              </tr>
            </thead>
            <tbody className="problem-management__table-body">
              {paginated.map((problem) => (
                <tr
                  key={problem.problemId}
                  className="problem-management__table-row"
                >
                  <td className="problem-management__table-cell">
                    <div className="problem-management__problem-info">
                      <span className="problem-management__problem-title">
                        {problem.title}
                      </span>
                      <span className="problem-management__problem-slug">
                        {problem.slug}
                      </span>
                    </div>
                  </td>
                  <td className="problem-management__table-cell">
                    <span
                      className={`problem-management__difficulty-badge ${getDifficultyModifier(
                        problem.difficulty
                      )}`}
                    >
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="problem-management__table-cell">
                    <div className="problem-management__tags">
                      {problem.tags ? (
                        problem.tags
                          .split(",")
                          .slice(0, 3)
                          .map((tag, idx) => (
                            <span key={idx} className="problem-management__tag">
                              {tag.trim()}
                            </span>
                          ))
                      ) : (
                        <span className="problem-management__tag">
                          Không có thẻ
                        </span>
                      )}
                      {problem.tags && problem.tags.split(",").length > 3 && (
                        <span className="problem-management__tag problem-management__tag--more">
                          +{problem.tags.split(",").length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="problem-management__table-cell">
                    <span className="problem-management__cell-text">
                      {problem.timeLimit}ms
                    </span>
                  </td>
                  <td className="problem-management__table-cell">
                    <span className="problem-management__cell-text">
                      {problem.memoryLimit}MB
                    </span>
                  </td>
                  <td className="problem-management__table-cell">
                    <span className="problem-management__date-text">
                      {new Date(problem.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </td>
                  <td className="problem-management__table-cell">
                    <div className="problem-management__actions">
                      <button
                        onClick={() => handleEdit(problem)}
                        className="problem-management__action-button problem-management__action-button--edit"
                        title="Chỉnh Sửa"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(problem.problemId)}
                        className="problem-management__action-button problem-management__action-button--delete"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="problem-management__pagination">
            <Pagination
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={filtered.length}
              align="end"
              onChange={(page) => handlePageChange(page)}
              showSizeChanger={false}
              showQuickJumper={false}
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} của ${total} kết quả`
              }
              style={{ textAlign: "right", marginTop: "1rem" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemManagement;
