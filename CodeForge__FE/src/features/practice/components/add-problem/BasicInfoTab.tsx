import { AlertCircle, FileText } from "lucide-react";

const BasicInfoTab = ({
  activeTab,
  problem,
  handleProblemChange,
  errors,
  getDifficultyColor,
  difficultyOptions,
  lessons,
}) => {
 
  return (
    <>
      {/* Basic Info Tab */}
      {activeTab === "basic" && (
        <div className="tab-content">
          <div className="tab-content__header">
            <div className="tab-content__icon">
              <FileText size={20} />
            </div>
            <h2>Thông Tin Cơ Bản</h2>
          </div>

          <div className="form">
            <div className="form-group form-group--full">
              <label className="form-label">
                Tên bài <span className="form-label--required">*</span>
              </label>
              <input
                type="text"
                value={problem.title}
                onChange={(e) => handleProblemChange("title", e.target.value)}
                className={`form-input ${
                  errors.title ? "form-input--error" : ""
                }`}
                placeholder="e.g., Sum of Two Integers"
              />
              {errors.title && (
                <p className="form-error">
                  <AlertCircle size={14} /> {errors.title}
                </p>
              )}
              {problem.slug && (
                <p className="form-hint">
                  Slug: <span className="form-hint--mono">{problem.slug}</span>
                </p>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Độ khó <span className="form-label--required">*</span>
                </label>
                <select
                  value={problem.difficulty}
                  onChange={(e) =>
                    handleProblemChange("difficulty", e.target.value)
                  }
                  className={`form-select form-select--${getDifficultyColor(
                    problem.difficulty
                  )}`}
                >
                  {difficultyOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  value={problem.status}
                  onChange={(e) =>
                    handleProblemChange("status", e.target.value)
                  }
                  className="form-select"
                >
                  <option value="NOT_STARTED">NOT STARTED</option>
                  <option value="ATTEMPTED">ATTEMPTED</option>
                  <option value="SOLVED">SOLVED</option>
                </select>
              </div> */}
            </div>

            <div className="form-group">
              <label className="form-label">
                Lesson <span className="form-label--required">*</span>
              </label>
              <select
                value={problem.lessonId}
                onChange={(e) =>
                  handleProblemChange("lessonId", e.target.value)
                }
                className={`form-select ${
                  errors.lessonId ? "form-select--error" : ""
                }`}
              >
                <option value="">-- Chọn Lesson --</option>
                {lessons.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>
                    {lesson.name}
                  </option>
                ))}
              </select>
              {errors.lessonId && (
                <p className="form-error">
                  <AlertCircle size={14} /> {errors.lessonId}
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Dạng bài</label>
              <input
                type="text"
                value={problem.tags}
                onChange={(e) => handleProblemChange("tags", e.target.value)}
                className="form-input"
                placeholder="Math, Array, String (phân cách bằng dấu phẩy)"
              />
              {problem.tags && (
                <div className="tags">
                  {problem.tags.split(",").map((tag: string, i: number) => (
                    <span key={i} className="tag">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group form-group--full">
              <label className="form-label">
                Mô tả bài toán <span className="form-label--required">*</span>
              </label>
              <textarea
                value={problem.description}
                onChange={(e) =>
                  handleProblemChange("description", e.target.value)
                }
                className={`form-textarea ${
                  errors.description ? "form-textarea--error" : ""
                }`}
                rows={6}
                placeholder="Mô tả chi tiết về bài toán..."
              />
              {errors.description && (
                <p className="form-error">
                  <AlertCircle size={14} /> {errors.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BasicInfoTab;
