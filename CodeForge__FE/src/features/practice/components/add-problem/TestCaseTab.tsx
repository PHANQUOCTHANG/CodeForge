import {
  AlertCircle,
  CheckCircle2,
  Code2,
  Eye,
  EyeOff,
  Info,
  Plus,
  TestTube,
  Trash2,
} from "lucide-react";
import type { ProblemTestCase, Variable } from "../../types/problem";

interface TestCaseTabProps {
  activeTab: string;
  validTestCasesCount: number;
  testCases: ProblemTestCase[];
  setTestCases: React.Dispatch<React.SetStateAction<ProblemTestCase[]>>;
  errors: Record<string, string>;
  returnTypes: string[];
}

const TestCaseTab: React.FC<TestCaseTabProps> = ({
  activeTab,
  validTestCasesCount,
  testCases,
  setTestCases,
  errors,
  returnTypes,
}) => {
  const addTestCase = () => {
    setTestCases([
      ...testCases,
      {
        input: [{ name: "", type: "int", value: "" }],
        expectedOutput: "",
        explain: "",
        isHidden: false,
      },
    ]);
  };

  const updateTestCase = (
    index: number,
    field: keyof ProblemTestCase,
    value: boolean | string
  ) => {
    const newTestCases = [...testCases];
    newTestCases[index] = {
      ...newTestCases[index],
      [field]: value,
    };
    setTestCases(newTestCases);
  };

  const removeTestCase = (index: number) => {
    if (testCases.length > 1) {
      setTestCases(testCases.filter((_, i) => i !== index));
    }
  };

  const updateVariable = (
    testCaseIndex: number,
    variableIndex: number,
    field: keyof Variable,
    value: string
  ) => {
    const newTestCases = [...testCases];
    newTestCases[testCaseIndex].input[variableIndex][field] = value;
    setTestCases(newTestCases);
  };

  const addVariable = (testCaseIndex: number) => {
    const newTestCases = [...testCases];
    newTestCases[testCaseIndex].input.push({
      name: "",
      type: "int",
      value: "",
    });
    setTestCases(newTestCases);
  };

  const removeVariable = (testCaseIndex: number, variableIndex: number) => {
    const newTestCases = [...testCases];
    if (newTestCases[testCaseIndex].input.length > 1) {
      newTestCases[testCaseIndex].input.splice(variableIndex, 1);
      setTestCases(newTestCases);
    }
  };
  return (
    <>
      {activeTab === "testcases" && (
        <div className="tab-content">
          {/* Header */}
          <div className="test-cases-header">
            <div className="test-cases-header__info">
              <div className="test-cases-header__icon">
                <TestTube size={24} />
              </div>
              <div className="test-cases-header__text">
                <h2>Các Test Case</h2>
                <p>
                  {validTestCasesCount} hợp lệ / {testCases.length} tổng
                </p>
              </div>
            </div>
            <button onClick={addTestCase} className="btn btn--primary">
              <Plus size={20} />
              <span>Thêm Test Case</span>
            </button>
          </div>

          {/* Error Alert */}
          {errors.testCases && (
            <div className="error-alert">
              <div className="error-alert__icon">
                <AlertCircle size={20} />
              </div>
              <div className="error-alert__content">
                <p className="error-alert__content-title">Lỗi Validation</p>
                <p className="error-alert__content-message">
                  {errors.testCases}
                </p>
              </div>
            </div>
          )}

          {/* Test Cases List */}
          <div className="test-cases">
            {testCases.map((testCase, tcIndex) => {
              const isValid =
                Array.isArray(testCase.input) &&
                testCase.input.some((v) => v.name && v.value) &&
                testCase.expectedOutput;

              return (
                <div key={tcIndex} className="test-case-card">
                  {/* Card Header */}
                  <div className="test-case-card__header">
                    <div className="test-case-card__title-group">
                      <span className="test-case-card__number">
                        {tcIndex + 1}
                      </span>
                      <h3 className="test-case-card__title">
                        Test Case #{tcIndex + 1}
                      </h3>
                      {isValid && (
                        <span className="badge badge--emerald">
                          <CheckCircle2 size={12} />
                          Hợp lệ
                        </span>
                      )}
                    </div>
                    <div className="test-case-card__status">
                      <button
                        onClick={() =>
                          updateTestCase(
                            tcIndex,
                            "isHidden",
                            !testCase.isHidden
                          )
                        }
                        className={`toggle-btn ${
                          testCase.isHidden
                            ? "toggle-btn--hidden"
                            : "toggle-btn--public"
                        }`}
                      >
                        {testCase.isHidden ? (
                          <>
                            <EyeOff size={16} />
                            <span>Ẩn</span>
                          </>
                        ) : (
                          <>
                            <Eye size={16} />
                            <span>Công khai</span>
                          </>
                        )}
                      </button>
                      {testCases.length > 1 && (
                        <button
                          onClick={() => removeTestCase(tcIndex)}
                          className="icon-btn"
                          title="Xóa test case"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="test-case-card__body">
                    {/* Input Variables */}
                    <div className="test-case-card__section">
                      <label className="test-case-card__section-label">
                        <Code2 size={16} />
                        Biến Đầu Vào
                        <span className="required">*</span>
                      </label>

                      <div className="test-case-card__variables">
                        {Array.isArray(testCase.input) &&
                          testCase.input.map((variable, varIndex) => (
                            <div key={varIndex} className="variable-row">
                              <div className="variable-row__fields">
                                <div className="variable-row__field">
                                  <label className="variable-row__label">
                                    Tên Biến
                                  </label>
                                  <input
                                    type="text"
                                    value={variable.name}
                                    onChange={(e) =>
                                      updateVariable(
                                        tcIndex,
                                        varIndex,
                                        "name",
                                        e.target.value
                                      )
                                    }
                                    className={`variable-row__input ${
                                      errors[`tc${tcIndex}var${varIndex}`]
                                        ? "variable-row__input--error"
                                        : ""
                                    }`}
                                    placeholder="a, arr, nums..."
                                  />
                                </div>
                                <div className="variable-row__field">
                                  <label className="variable-row__label">
                                    Kiểu Dữ Liệu
                                  </label>
                                  <select
                                    value={variable.type}
                                    onChange={(e) =>
                                      updateVariable(
                                        tcIndex,
                                        varIndex,
                                        "type",
                                        e.target.value
                                      )
                                    }
                                    className="variable-row__select"
                                  >
                                    {returnTypes.map((type) => (
                                      <option key={type} value={type}>
                                        {type}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div className="variable-row__field">
                                  <label className="variable-row__label">
                                    Giá Trị
                                  </label>
                                  <input
                                    type="text"
                                    value={variable.value}
                                    onChange={(e) =>
                                      updateVariable(
                                        tcIndex,
                                        varIndex,
                                        "value",
                                        e.target.value
                                      )
                                    }
                                    className={`variable-row__input ${
                                      errors[`tc${tcIndex}var${varIndex}`]
                                        ? "variable-row__input--error"
                                        : ""
                                    }`}
                                    placeholder='5, [1,2,3], "hello"...'
                                  />
                                </div>
                              </div>
                              {testCase.input.length > 1 && (
                                <button
                                  onClick={() =>
                                    removeVariable(tcIndex, varIndex)
                                  }
                                  className="variable-row__remove"
                                  type="button"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          ))}
                      </div>

                      <button
                        onClick={() => addVariable(tcIndex)}
                        className="add-variable-btn"
                        type="button"
                      >
                        <Plus size={16} />
                        <span>Thêm Biến</span>
                      </button>

                      {errors[`tc${tcIndex}var0`] && (
                        <div className="field-group__error">
                          <AlertCircle size={14} />
                          <span>{errors[`tc${tcIndex}var0`]}</span>
                        </div>
                      )}
                    </div>

                    {/* Expected Output */}
                    <div className="test-case-card__section">
                      <label className="test-case-card__section-label">
                        <CheckCircle2 size={16} />
                        Kết Quả Mong Đợi
                        <span className="required">*</span>
                      </label>
                      <textarea
                        value={testCase.expectedOutput}
                        onChange={(e) =>
                          updateTestCase(
                            tcIndex,
                            "expectedOutput",
                            e.target.value
                          )
                        }
                        className={`field-group__textarea ${
                          errors[`tc${tcIndex}output`]
                            ? "field-group__textarea--error"
                            : ""
                        }`}
                        rows={3}
                        placeholder="Nhập kết quả mong đợi..."
                      />
                      {errors[`tc${tcIndex}output`] && (
                        <div className="field-group__error">
                          <AlertCircle size={14} />
                          <span>{errors[`tc${tcIndex}output`]}</span>
                        </div>
                      )}
                    </div>

                    {/* Explanation */}
                    <div className="test-case-card__section">
                      <label className="test-case-card__section-label">
                        <Info size={16} />
                        Giải Thích (Tùy chọn)
                      </label>
                      <textarea
                        value={testCase.explain}
                        onChange={(e) =>
                          updateTestCase(tcIndex, "explain", e.target.value)
                        }
                        className="field-group__textarea"
                        rows={2}
                        placeholder="Giải thích về test case này..."
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default TestCaseTab;
