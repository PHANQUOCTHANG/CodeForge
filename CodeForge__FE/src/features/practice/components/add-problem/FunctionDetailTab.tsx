import { Code2, Info } from "lucide-react";

const FunctionDetailTab = ({
  activeTab,
  problem,
  handleProblemChange,
  returnTypes,
}) => {
  return (
    <>
      {/* Function Details Tab */}
      {activeTab === "function" && (
        <div className="tab-content">
          <div className="tab-content__header">
            <div className="tab-content__icon">
              <Code2 size={20} />
            </div>
            <h2>Chi Tiết Function</h2>
          </div>

          <div className="info-box">
            <Info size={16} />
            <p>Định nghĩa signature của function mà học viên cần implement</p>
          </div>

          <div className="form">
            <div className="form-row form-row--3">
              <div className="form-group">
                <label className="form-label">Tên Function</label>
                <input
                  type="text"
                  value={problem.functionName}
                  onChange={(e) =>
                    handleProblemChange("functionName", e.target.value)
                  }
                  className="form-input form-input--mono"
                  placeholder="sumTwoIntegers"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Các Tham Số</label>
                <input
                  type="text"
                  value={problem.parameters}
                  onChange={(e) =>
                    handleProblemChange("parameters", e.target.value)
                  }
                  className="form-input form-input--mono"
                  placeholder="int a, int b"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Kiểu Dữ Liệu Trả Về{" "}
                  <span className="form-label--required">*</span>
                </label>
                <select
                  value={problem.returnType}
                  onChange={(e) =>
                    handleProblemChange("returnType", e.target.value)
                  }
                  className="form-select form-select--mono"
                >
                  {returnTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {problem.functionName && problem.returnType && (
              <div className="code-preview">
                <div className="code-preview__comment">
                  // Function Signature:
                </div>
                <div className="code-preview__code">
                  <span className="code-preview__type">
                    {problem.returnType}
                  </span>{" "}
                  <span className="code-preview__name">
                    {problem.functionName}
                  </span>
                  <span className="code-preview__punctuation">(</span>
                  <span className="code-preview__params">
                    {problem.parameters || "..."}
                  </span>
                  <span className="code-preview__punctuation">)</span>
                </div>
              </div>
            )}

            <div className="form-group form-group--full">
              <label className="form-label">Điều Kiện Ràng Buộc</label>
              <textarea
                value={problem.constraints}
                onChange={(e) =>
                  handleProblemChange("constraints", e.target.value)
                }
                className="form-textarea form-textarea--mono"
                rows={4}
                placeholder="-10^9 <= a, b <= 10^9&#10;1 <= array.length <= 1000"
              />
            </div>

            <div className="form-group form-group--full">
              <label className="form-label">Ghi Chú</label>
              <textarea
                value={problem.notes}
                onChange={(e) => handleProblemChange("notes", e.target.value)}
                className="form-textarea"
                rows={4}
                placeholder="Ghi chú thêm về cách giải, hints cho học viên..."
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FunctionDetailTab;
