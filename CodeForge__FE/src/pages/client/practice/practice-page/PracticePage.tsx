import { useEffect, useState } from "react";
import { Search, CheckCircle2, Circle } from "lucide-react";
import { Pagination } from "antd";
import "./PracticePage.scss";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loading from "@/common/helper/Loading";
import { openNotification } from "@/common/helper/Alert";
import practiceService from "@/features/practice/services/practiceService";

interface Problem {
  problemId: number;
  title: string;
  slug: string;
  difficulty: "Dễ" | "Trung Bình" | "Khó";
  status?: "solved" | "attempted";
  tags: string;
  acceptance?: number;
}

// Constants
const PAGE_SIZE = 10;
const STATUS_SOLVED = "SOLVED";
const STATUS_ATTEMPTED = "ATTEMPTED";

const ProblemsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    () => searchParams.get("search") || ""
  );
  const [difficultyFilter, setDifficultyFilter] = useState(
    () => searchParams.get("difficulty") || "all"
  );
  const [statusFilter, setStatusFilter] = useState(
    () => searchParams.get("status") || "all"
  );
  const [tagFilter, setTagFilter] = useState(
    () => searchParams.get("tag") || "all"
  );

  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentPage, setCurrentPage] = useState(() => {
    const pageFromUrl = searchParams.get("page");
    return pageFromUrl ? parseInt(pageFromUrl, 10) : 1;
  });
  const [pageSize] = useState(PAGE_SIZE);

  useEffect(() => {
    const loadProblems = async () => {
      try {
        const data = await practiceService.getAllProblem();
        setProblems(data);
      } catch (error) {
        console.error("Failed to load problems:", error);
        openNotification("error", "Lỗi khi tải danh sách bài tập", "");
      } finally {
        setLoading(false);
      }
    };

    loadProblems();
  }, []);

  // Update URL when filters/search change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (difficultyFilter !== "all") params.set("difficulty", difficultyFilter);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (tagFilter !== "all") params.set("tag", tagFilter);

    navigate(`?${params.toString()}`, { replace: true });
    setCurrentPage(1);
  }, [searchTerm, difficultyFilter, statusFilter, tagFilter, navigate]);

  const allTags = [
    ...new Set(
      problems.flatMap((p) =>
        p.tags ? p.tags.split(",").map((tag) => tag.trim()) : []
      )
    ),
  ];

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.problemId.toString().includes(searchTerm);

    const matchesDifficulty =
      difficultyFilter === "all" || problem.difficulty === difficultyFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "solved" && problem.status === "solved") ||
      (statusFilter === "attempted" && problem.status === "attempted") ||
      (statusFilter === "todo" && !problem.status);

    const problemTags = problem.tags
      ? problem.tags.split(",").map((tag) => tag.trim().toLowerCase())
      : [];
    const matchesTag =
      tagFilter === "all" || problemTags.includes(tagFilter.toLowerCase());

    return matchesSearch && matchesDifficulty && matchesStatus && matchesTag;
  });

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProblems = filteredProblems.slice(
    startIndex,
    startIndex + pageSize
  );

  const getStatusIcon = (status?: string) => {
    if (status === STATUS_SOLVED)
      return (
        <CheckCircle2 className="practice-problem-list__status-icon practice-problem-list__status-icon--solved" />
      );
    if (status === STATUS_ATTEMPTED)
      return (
        <Circle className="practice-problem-list__status-icon practice-problem-list__status-icon--attempted" />
      );
    return (
      <Circle className="practice-problem-list__status-icon practice-problem-list__status-icon--todo" />
    );
  };

  const buildQueryParams = (page?: number) => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (difficultyFilter !== "all") params.set("difficulty", difficultyFilter);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (tagFilter !== "all") params.set("tag", tagFilter);
    if (page) params.set("page", page.toString());
    return params;
  };

  const stats = {
    solved: problems.filter((p) => p.status === "solved").length,
    attempted: problems.filter((p) => p.status === "attempted").length,
    total: problems.length,
    easy: problems.filter(
      (p) => p.difficulty === "Dễ" && p.status === "solved"
    ).length,
    medium: problems.filter(
      (p) => p.difficulty === "Trung Bình" && p.status === "solved"
    ).length,
    hard: problems.filter(
      (p) => p.difficulty === "Khó" && p.status === "solved"
    ).length,
  };

  const totals = {
    easy: problems.filter((p) => p.difficulty === "Dễ").length,
    medium: problems.filter((p) => p.difficulty === "Trung Bình").length,
    hard: problems.filter((p) => p.difficulty === "Khó").length,
  };

  const handleProblem = (slug: string) => {
    navigate(`${slug}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    navigate(`?${buildQueryParams(page).toString()}`);
  };

  return (
    <>
      {loading && <Loading />}
      <div className="practice-problems-page">
        <div className="practice-container">
          <div className="practice-stats-cards">
            <div className="practice-stats-cards__card">
              <div className="practice-stats-cards__content">
                <p className="practice-stats-cards__label">Dễ</p>
                <p className="practice-stats-cards__value">
                  {stats.easy}
                  <span className="practice-stats-cards__total">
                    {" "}
                    / {totals.easy}
                  </span>
                </p>
              </div>
            </div>

            <div className="practice-stats-cards__card">
              <div className="practice-stats-cards__content">
                <p className="practice-stats-cards__label">Trung Bình</p>
                <p className="practice-stats-cards__value">
                  {stats.medium}
                  <span className="practice-stats-cards__total">
                    {" "}
                    / {totals.medium}
                  </span>
                </p>
              </div>
            </div>

            <div className="practice-stats-cards__card">
              <div className="practice-stats-cards__content">
                <p className="practice-stats-cards__label">Khó</p>
                <p className="practice-stats-cards__value">
                  {stats.hard}
                  <span className="practice-stats-cards__total">
                    {" "}
                    / {totals.hard}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="practice-filters">
            <div className="practice-filters__wrapper">
              <div className="practice-filters__search">
                <Search className="practice-filters__search-icon" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài tập..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="practice-filters__search-input"
                />
              </div>

              <div className="practice-filters__row">
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="practice-filters__select"
                >
                  <option value="all">Tất Cả Độ Khó</option>
                  <option value="Dễ">Dễ</option>
                  <option value="Trung Bình">Trung Bình</option>
                  <option value="Khó">Khó</option>
                </select>

                {/* <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="practice-filters__select"
                >
                  <option value="all">Tất Cả Trạng Thái</option>
                  <option value="solved">Đã Giải</option>
                  <option value="attempted">Đã Thử</option>
                  <option value="todo">Chưa Làm</option>
                </select> */}

                <select
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  className="practice-filters__select"
                >
                  <option value="all">Tất Cả Thẻ</option>
                  {allTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="practice-problem-list">
            <div className="practice-problem-list__container">
              <table className="practice-problem-list__table">
                <thead>
                  <tr>
                    <th className="practice-problem-list__th practice-problem-list__th--status">
                      Trạng Thái
                    </th>
                    <th className="practice-problem-list__th practice-problem-list__th--title">
                      Tên Bài Tập
                    </th>
                    <th className="practice-problem-list__th practice-problem-list__th--difficulty">
                      Độ Khó
                    </th>
                    <th className="practice-problem-list__th practice-problem-list__th--acceptance">
                      Tỉ Lệ Đạt
                    </th>
                    <th className="practice-problem-list__th practice-problem-list__th--tags">
                      Thẻ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProblems.map((problem, index) => (
                    <tr
                      key={problem.problemId}
                      className="practice-problem-list__row"
                      onClick={() => handleProblem(problem.slug)}
                    >
                      <td className="practice-problem-list__td practice-problem-list__td--status">
                        {getStatusIcon(problem.status)}
                      </td>
                      <td className="practice-problem-list__td practice-problem-list__td--title">
                        <div className="practice-problem-list__title-wrapper">
                          <span className="practice-problem-list__problem-id">
                            {startIndex + index + 1}.
                          </span>
                          <span className="practice-problem-list__problem-title">
                            {problem.title}
                          </span>
                        </div>
                      </td>
                      <td className="practice-problem-list__td practice-problem-list__td--difficulty">
                        <span
                          className={`practice-problem-list__difficulty practice-problem-list__difficulty--${problem.difficulty.toLowerCase()}`}
                        >
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="practice-problem-list__td practice-problem-list__td--acceptance">
                        {problem.acceptance}
                      </td>
                      <td className="practice-problem-list__td practice-problem-list__td--tags">
                        <div className="practice-problem-list__tags-wrapper">
                          {problem.tags &&
                            problem.tags.split(",").map((tag, idx) => (
                              <span
                                key={idx}
                                className="practice-problem-list__tag"
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredProblems.length > 0 && (
              <div className="practice-problem-list__pagination">
                <Pagination
                  current={currentPage}
                  total={filteredProblems.length}
                  align="center"
                  pageSize={pageSize}
                  onChange={handlePageChange}
                />
              </div>
            )}

            {filteredProblems.length === 0 && (
              <div className="practice-problem-list__empty-state">
                <p>Không tìm thấy bài tập nào phù hợp với bộ lọc của bạn.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProblemsPage;
