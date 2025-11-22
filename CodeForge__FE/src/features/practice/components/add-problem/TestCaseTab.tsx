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
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import type { ProblemTestCase, Variable } from "../../types/problem";
import ConfirmDialog from "./ConfirmDialog";

interface TestCaseTabProps {
  activeTab: string;
  validTestCasesCount: number;
  testCases: (ProblemTestCase & { testCaseId?: string })[];
  setTestCases: React.Dispatch<
    React.SetStateAction<(ProblemTestCase & { testCaseId?: string })[]>
  >;
  errors: Record<string, string>;
  returnTypes: string[];
  onTestCaseUpdate?: (
    testCases: (ProblemTestCase & { testCaseId?: string })[]
  ) => void;
  onTestCaseDelete?: (testCaseId: string) => void;
}

const EXPAND_BUTTON_STYLES = {
  background: "none",
  border: "none",
  cursor: "pointer" as const,
  padding: "0",
  display: "flex" as const,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  width: "24px",
  height: "24px",
  color: "#6b7280",
  transition: "color 0.2s ease",
};

const TestCaseTab: React.FC<TestCaseTabProps> = ({
  activeTab,
  validTestCasesCount,
  testCases,
  setTestCases,
  errors,
  returnTypes,
  onTestCaseUpdate,
  onTestCaseDelete,
}) => {
  const [expandedCases, setExpandedCases] = useState<Record<number, boolean>>(
    testCases.reduce((acc, _, index) => ({ ...acc, [index]: false }), {})
  );

  // State cho dialog xác nhận xóa
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    index: number;
  }>({
    isOpen: false,
    index: -1,
  });

  const [isDeleting, setIsDeleting] = useState(false);

  /** Bật/tắt hiển thị chi tiết test case */
  const toggleExpand = (index: number) => {
    setExpandedCases((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  /** Thêm test case mới ở đầu danh sách và mở rộng */
  const addTestCase = () => {
    const newTestCase = {
      input: [{ name: "", type: "int", value: "" }],
      expectedOutput: "",
      explain: "",
      isHidden: false,
    };
    setTestCases([newTestCase, ...testCases]);

    // Cập nhật state mở rộng: test case mới ở index 0 luôn mở
    setExpandedCases((prev) => {
      const newExpanded: Record<number, boolean> = { 0: true };
      Object.entries(prev).forEach(([key, val]) => {
        newExpanded[Number(key) + 1] = val;
      });
      return newExpanded;
    });
  };

  /** Cập nhật field của test case (expectedOutput, isHidden, explain) */
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

    // Auto-save nếu test case hợp lệ
    if (onTestCaseUpdate) {
      console.log(newTestCases) ;
      onTestCaseUpdate(newTestCases);
    }
  };

  /** Xóa test case (gọi callback để xóa khỏi database) */
  const removeTestCase = (index: number) => {
    const testCaseToDelete = testCases[index];
    let newTestCases: (ProblemTestCase & { testCaseId?: string })[];

    if (testCases.length > 1) {
      // Nếu có nhiều hơn 1 testcase, xóa testcase ở vị trí index
      newTestCases = testCases.filter((_, i) => i !== index);
    } else {
      // Nếu chỉ còn 1 testcase, thay thế nó bằng một testcase trống mới
      newTestCases = [
        {
          input: [{ name: "", type: "int", value: "" }],
          expectedOutput: "",
          explain: "",
          isHidden: false,
        },
      ];
    }

    setTestCases(newTestCases);

    // Gọi callback để xóa khỏi database (truyền testCaseId nếu có)
    // Chỉ gọi nếu testCaseId tồn tại và không phải rỗng
    if (
      onTestCaseDelete &&
      testCaseToDelete?.testCaseId &&
      testCaseToDelete.testCaseId.trim() !== ""
    ) {
      console.log(testCaseToDelete.testCaseId) ;
      onTestCaseDelete(testCaseToDelete.testCaseId);
    }
  };

  /** Mở dialog xác nhận xóa */
  const handleDeleteClick = (index: number) => {
    setConfirmDelete({
      isOpen: true,
      index,
    });
  };

  /** Xóa testcase sau khi người dùng xác nhận */
  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      removeTestCase(confirmDelete.index);
      setConfirmDelete({ isOpen: false, index: -1 });
    } finally {
      setIsDeleting(false);
    }
  };

  /** Cập nhật biến input (name, type, value) */
  const updateVariable = (
    testCaseIndex: number,
    variableIndex: number,
    field: keyof Variable,
    value: string
  ) => {
    const newTestCases = [...testCases];
    newTestCases[testCaseIndex].input[variableIndex][field] = value;
    setTestCases(newTestCases);

    // Auto-save nếu test case hợp lệ
    if (onTestCaseUpdate) {
      onTestCaseUpdate(newTestCases);
    }
  };

  /** Thêm biến input mới */
  const addVariable = (testCaseIndex: number) => {
    const newTestCases = [...testCases];
    newTestCases[testCaseIndex].input.push({
      name: "",
      type: "int",
      value: "",
    });
    setTestCases(newTestCases);
  };

  /** Xóa biến input */
  const removeVariable = (testCaseIndex: number, variableIndex: number) => {
    const newTestCases = [...testCases];
    if (newTestCases[testCaseIndex].input.length > 1) {
      newTestCases[testCaseIndex].input.splice(variableIndex, 1);
      setTestCases(newTestCases);
    }
  };

  if (activeTab !== "testcases") {
    return null;
  }

  return (
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

      {/* Lỗi validation */}
      {errors.testCases && (
        <div className="error-alert">
          <div className="error-alert__icon">
            <AlertCircle size={20} />
          </div>
          <div className="error-alert__content">
            <p className="error-alert__content-title">Lỗi Validation</p>
            <p className="error-alert__content-message">{errors.testCases}</p>
          </div>
        </div>
      )}

      {/* Danh sách test cases */}
      <div className="test-cases">
        {testCases.map((testCase, tcIndex) => {
          const isValid =
            Array.isArray(testCase.input) &&
            testCase.input.some((v) => v.name && v.value) &&
            testCase.expectedOutput;

          return (
            <div key={tcIndex} className="test-case-card">
              {/* Header - bấm để mở/đóng chi tiết */}
              <div className="test-case-card__header">
                <div className="test-case-card__title-group">
                  {/* Nút mở/đóng */}
                  <button
                    onClick={() => toggleExpand(tcIndex)}
                    style={EXPAND_BUTTON_STYLES}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#374151")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#6b7280")
                    }
                    title={expandedCases[tcIndex] ? "Thu gọn" : "Mở rộng"}
                  >
                    <ChevronDown
                      size={18}
                      style={{
                        transform: expandedCases[tcIndex]
                          ? "rotate(0deg)"
                          : "rotate(-90deg)",
                        transition: "transform 0.2s ease",
                      }}
                    />
                  </button>

                  {/* Số thứ tự */}
                  <span className="test-case-card__number">{tcIndex + 1}</span>

                  {/* Tiêu đề */}
                  <h3 className="test-case-card__title">
                    Test Case #{tcIndex + 1}
                  </h3>

                  {/* Badge hợp lệ */}
                  {isValid && (
                    <span className="badge badge--emerald">
                      <CheckCircle2 size={12} />
                      Hợp lệ
                    </span>
                  )}
                </div>

                {/* Action buttons */}
                <div className="test-case-card__status">
                  {/* Nút ẩn/công khai */}
                  <button
                    onClick={() =>
                      updateTestCase(tcIndex, "isHidden", !testCase.isHidden)
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

                  {/* Nút xóa */}
                  <button
                    onClick={() => handleDeleteClick(tcIndex)}
                    className="icon-btn"
                    title="Xóa test case"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Chi tiết - hiển thị khi mở rộng */}
              {expandedCases[tcIndex] && (
                <div className="test-case-card__body">
                  {/* Phần biến đầu vào */}
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
                              {/* Tên biến */}
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

                              {/* Kiểu dữ liệu */}
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

                              {/* Giá trị */}
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

                            {/* Nút xóa biến */}
                            {testCase.input.length > 1 && (
                              <button
                                onClick={() =>
                                  removeVariable(tcIndex, varIndex)
                                }
                                className="variable-row__remove"
                                type="button"
                                title="Xóa biến"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                    </div>

                    {/* Nút thêm biến */}
                    <button
                      onClick={() => addVariable(tcIndex)}
                      className="add-variable-btn"
                      type="button"
                    >
                      <Plus size={16} />
                      <span>Thêm Biến</span>
                    </button>

                    {/* Lỗi biến */}
                    {errors[`tc${tcIndex}var0`] && (
                      <div className="field-group__error">
                        <AlertCircle size={14} />
                        <span>{errors[`tc${tcIndex}var0`]}</span>
                      </div>
                    )}
                  </div>

                  {/* Phần kết quả mong đợi */}
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

                  {/* Phần giải thích (tùy chọn) */}
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
              )}
            </div>
          );
        })}
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        title="Xóa Test Case"
        message={`Bạn có chắc chắn muốn xóa Test Case #${
          confirmDelete.index + 1
        }? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        isDangerous={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete({ isOpen: false, index: -1 })}
      />
    </div>
  );
};

export default TestCaseTab;
