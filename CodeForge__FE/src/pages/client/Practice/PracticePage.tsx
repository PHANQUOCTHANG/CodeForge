import React, { useEffect, useState } from "react";
import { Search, CheckCircle2, Circle } from "lucide-react";
import "./PracticePage.scss";
import { useNavigate } from "react-router-dom";
import Loading from "@/helper/Loading";
import { openNotification } from "@/helper/Alert";

interface Problem {
  problemId: number;
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status?: "solved" | "attempted";
  tags: string;
  acceptance?: number;
}

const ProblemsPage = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState<Problem[]>([]);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const getProblem = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/problem`);

        if (response.ok) {
          const problemData = await response.json();
          setProblems(problemData.data);
        } else {
          openNotification("error", "Failed to fetch problems", "");
        }
      } catch (_err) {
        openNotification("error", "Error occurred while fetching problems", "");
      }
    };

    const fetchData = async () => {
      await getProblem();
      setLoading(false);
    };
    fetchData();
  }, [apiUrl]);

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

  const getStatusIcon = (status?: "solved" | "attempted") => {
    if (status === "solved")
      return (
        <CheckCircle2 className="practice-problem-list__status-icon practice-problem-list__status-icon--solved" />
      );
    if (status === "attempted")
      return (
        <Circle className="practice-problem-list__status-icon practice-problem-list__status-icon--attempted" />
      );
    return (
      <Circle className="practice-problem-list__status-icon practice-problem-list__status-icon--todo" />
    );
  };

  const stats = {
    solved: problems.filter((p) => p.status === "solved").length,
    attempted: problems.filter((p) => p.status === "attempted").length,
    total: problems.length,
    easy: problems.filter(
      (p) => p.difficulty === "Easy" && p.status === "solved"
    ).length,
    medium: problems.filter(
      (p) => p.difficulty === "Medium" && p.status === "solved"
    ).length,
    hard: problems.filter(
      (p) => p.difficulty === "Hard" && p.status === "solved"
    ).length,
  };

  const totalEasy = problems.filter((p) => p.difficulty === "Easy").length;
  const totalMedium = problems.filter((p) => p.difficulty === "Medium").length;
  const totalHard = problems.filter((p) => p.difficulty === "Hard").length;

  // handle problem
  const handleProblem = (slug: string) => {
    navigate(`${slug}`);
  };

  return (
    <>
      {loading && <Loading />}
      <div className="practice-problems-page">
        <div className="practice-container">
          {/* Practice Statistics Cards (practice-stats-cards) */}
          <div className="practice-stats-cards">
            {/* ... Stats cards (Easy) ... */}
            <div className="practice-stats-cards__card">
              <div className="practice-stats-cards__content">
                <p className="practice-stats-cards__label">Easy</p>
                <p className="practice-stats-cards__value">
                  {stats.easy}
                  <span className="practice-stats-cards__total">
                    {" "}
                    / {totalEasy}
                  </span>
                </p>
              </div>
            </div>

            {/* ... Stats cards (Medium) ... */}
            <div className="practice-stats-cards__card">
              <div className="practice-stats-cards__content">
                <p className="practice-stats-cards__label">Medium</p>
                <p className="practice-stats-cards__value">
                  {stats.medium}
                  <span className="practice-stats-cards__total">
                    {" "}
                    / {totalMedium}
                  </span>
                </p>
              </div>
            </div>

            {/* ... Stats cards (Hard) ... */}
            <div className="practice-stats-cards__card">
              <div className="practice-stats-cards__content">
                <p className="practice-stats-cards__label">Hard</p>
                <p className="practice-stats-cards__value">
                  {stats.hard}
                  <span className="practice-stats-cards__total">
                    {" "}
                    / {totalHard}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Practice Filters (practice-filters) */}
          <div className="practice-filters">
            <div className="practice-filters__wrapper">
              {/* Search Input */}
              <div className="practice-filters__search">
                <Search className="practice-filters__search-icon" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="practice-filters__search-input"
                />
              </div>

              {/* Filter Selects Row */}
              <div className="practice-filters__row">
                {/* Difficulty Filter */}
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="practice-filters__select"
                >
                  <option value="all">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="practice-filters__select"
                >
                  <option value="all">All Status</option>
                  <option value="solved">Solved</option>
                  <option value="attempted">Attempted</option>
                  <option value="todo">To Do</option>
                </select>

                {/* Tag Filter */}
                <select
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  className="practice-filters__select"
                >
                  <option value="all">All Tags</option>
                  {allTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Practice Problem List (practice-problem-list) */}
          <div className="practice-problem-list">
            <div className="practice-problem-list__container">
              <table className="practice-problem-list__table">
                <thead>
                  <tr>
                    <th className="practice-problem-list__th practice-problem-list__th--status">
                      Status
                    </th>
                    <th className="practice-problem-list__th practice-problem-list__th--title">
                      Title
                    </th>
                    <th className="practice-problem-list__th practice-problem-list__th--difficulty">
                      Difficulty
                    </th>
                    <th className="practice-problem-list__th practice-problem-list__th--acceptance">
                      Acceptance
                    </th>
                    <th className="practice-problem-list__th practice-problem-list__th--tags">
                      Tags
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProblems.map((problem, index) => (
                    // *** UPDATED: Use problem.slug for onClick navigation ***
                    // Use problemId as the key
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
                          {/* NOTE: If you want to display an index number (1. 2. 3.), you'll need to use the index from the map, not problem.problemId */}
                          <span className="practice-problem-list__problem-id">
                            {index + 1}.
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

            {filteredProblems.length === 0 && (
              <div className="practice-problem-list__empty-state">
                <p>No problems found matching your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProblemsPage;
