import React from "react";
import { CheckCircle2, Copy, Download } from "lucide-react";
import type { Variable, ProblemTestCase } from "../../types/problem";
import { useNavigate } from "react-router-dom";

interface Lesson {
  id: string;
  name: string;
}

interface FormResultModalProps {
  showResultModal: boolean;
  setShowResultModal: React.Dispatch<React.SetStateAction<boolean>>;
  submittedData: {
    problem: {
      title: string;
      slug: string;
      difficulty: string;
      lessonId?: string | null;
      tags?: string;
      description?: string;
      functionName?: string;
      returnType?: string;
      parameters?: string;
      constraints?: string;
    };
    testCases: ProblemTestCase[];
  } | null;
  getDifficultyColor: (diff: string) => string;
  lessons: Lesson[];
  copyToClipboard: () => void;
  downloadJSON: () => void;
}

const FormResultModal: React.FC<FormResultModalProps> = ({
  showResultModal,
  setShowResultModal,
  submittedData,
  getDifficultyColor,
  lessons,
  copyToClipboard,
  downloadJSON,
}) => {
  const navigate = useNavigate();

  const handleClose = () => {
    setShowResultModal(false);
    navigate("/admin/problems");
  };
  return (
    <>
      {/* Result Modal */}
      {showResultModal && submittedData && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal__header">
              <div className="modal__header-content">
                <CheckCircle2 size={24} />
                <h2>Kết Quả Đã Submit</h2>
              </div>
              <button
                onClick={() => setShowResultModal(false)}
                className="modal__close"
              >
                ×
              </button>
            </div>

            <div className="modal__body">
              {/* Problem Summary */}
              <div className="result-section">
                <h3>Thông Tin Bài Toán</h3>
                <div className="result-grid">
                  <div className="result-item">
                    <span className="result-item__label">Title:</span>
                    <p className="result-item__value">
                      {submittedData.problem.title}
                    </p>
                  </div>
                  <div className="result-item">
                    <span className="result-item__label">Slug:</span>
                    <p className="result-item__value result-item__value--mono">
                      {submittedData.problem.slug}
                    </p>
                  </div>
                  <div className="result-item">
                    <span className="result-item__label">Difficulty:</span>
                    <span
                      className={`badge badge--${getDifficultyColor(
                        submittedData.problem.difficulty
                      )}`}
                    >
                      {submittedData.problem.difficulty}
                    </span>
                  </div>
                  <div className="result-item">
                    <span className="result-item__label">Lesson:</span>
                    <p className="result-item__value">
                      {
                        lessons.find(
                          (l: Lesson) => l.id === submittedData.problem.lessonId
                        )?.name
                      }
                    </p>
                  </div>
                  <div className="result-item result-item--full">
                    <span className="result-item__label">Tags:</span>
                    <div className="tags">
                      {(submittedData.problem.tags || "")
                        .split(",")
                        .filter(Boolean)
                        .map((tag: string, i: number) => (
                          <span key={i} className="tag">
                            {tag}
                          </span>
                        ))}
                    </div>
                  </div>
                  <div className="result-item result-item--full">
                    <span className="result-item__label">Description:</span>
                    <p className="result-item__value">
                      {submittedData.problem.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Function Details */}
              {submittedData.problem.functionName && (
                <div className="result-section">
                  <h3>Function Details</h3>
                  <div className="code-block">
                    <span className="code-block__type">
                      {submittedData.problem.returnType}
                    </span>{" "}
                    <span className="code-block__name">
                      {submittedData.problem.functionName}
                    </span>
                    <span className="code-block__punctuation">(</span>
                    <span className="code-block__params">
                      {submittedData.problem.parameters}
                    </span>
                    <span className="code-block__punctuation">)</span>
                  </div>
                  {submittedData.problem.constraints && (
                    <div className="constraints">
                      <span className="result-item__label">Constraints:</span>
                      <pre>{submittedData.problem.constraints}</pre>
                    </div>
                  )}
                </div>
              )}

              {/* Test Cases */}
              <div className="result-section">
                <h3>Test Cases ({submittedData.testCases.length})</h3>
                <div className="test-cases">
                  {submittedData.testCases.map((tc, index: number) => (
                    <div key={index} className="test-case">
                      <div className="test-case__header">
                        <span className="test-case__title">
                          Test Case #{index + 1}
                        </span>
                        <span
                          className={`badge badge--${
                            tc.isHidden ? "slate" : "emerald"
                          }`}
                        >
                          {tc.isHidden ? "Hidden" : "Public"}
                        </span>
                      </div>

                      <div className="test-case__content">
                        <div className="test-case__section">
                          <span className="test-case__label">
                            Input Variables:
                          </span>
                          <div className="variables">
                            {Array.isArray(tc.input) &&
                              tc.input.map((v: Variable, vi: number) => (
                                <div key={vi} className="variable">
                                  <span className="variable__type">
                                    {v.type}
                                  </span>{" "}
                                  <span className="variable__name">
                                    {v.name}
                                  </span>{" "}
                                  ={" "}
                                  <span className="variable__value">
                                    {v.value}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>

                        <div className="test-case__section">
                          <span className="test-case__label">
                            Expected Output:
                          </span>
                          <pre className="test-case__output">
                            {tc.expectedOutput}
                          </pre>
                        </div>

                        {tc.explain && (
                          <div className="test-case__section">
                            <span className="test-case__label">
                              Explanation:
                            </span>
                            <p className="test-case__explain">{tc.explain}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* JSON Output */}
              <div className="result-section">
                <div className="result-section__header">
                  <h3>JSON Output</h3>
                  <div className="result-section__actions">
                    <button
                      onClick={copyToClipboard}
                      className="btn btn--secondary btn--sm"
                    >
                      <Copy size={16} />
                      Copy
                    </button>
                    <button
                      onClick={downloadJSON}
                      className="btn btn--primary btn--sm"
                    >
                      <Download size={16} />
                      Download
                    </button>
                  </div>
                </div>
                <div className="json-output">
                  <pre>{JSON.stringify(submittedData, null, 2)}</pre>
                </div>
              </div>
            </div>

            <div className="modal__footer">
              <button onClick={handleClose} className="btn btn--secondary">
                Đóng
              </button>
              <button onClick={() => navigate("/admin/problems/create")} className="btn btn--primary">
                Tạo Bài Mới
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormResultModal;
