import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Eye,
  ArrowLeft,
  Code2,
  FileText,
  Settings,
  TestTube,
  AlertCircle,
  CheckCircle2,
  Copy,
  Download,
  RefreshCw,
} from "lucide-react";
import "../add-problem/AddProblem.scss";
import practiceService from "@/features/practice/services/practiceService";
import FunctionDetailTab from "@/features/practice/components/add-problem/FunctionDetailTab";
import LimitTab from "@/features/practice/components/add-problem/LimitTab";
import BasicInfoTab from "@/features/practice/components/add-problem/BasicInfoTab";
import TestCaseTab from "@/features/practice/components/add-problem/TestCaseTab";
import FormResultModal from "@/features/practice/components/add-problem/FormResultModal";
import type {
  DifficultyOption,
  Errors,
  Lesson,
  Problem,
  ProblemTestCase,
  TabItem,
  TestCase,
  Notification,
} from "@/features/practice/types/problem";
import QuickStats from "@/features/practice/components/add-problem/QuickStats";
import Loading from "@/common/helper/Loading";

// ============================================================================
// CONSTANTS
// ============================================================================

const DIFFICULTY_OPTIONS: DifficultyOption[] = [
  { value: "Dễ", label: "Dễ", color: "emerald" },
  { value: "Trung Bình", label: "Trung Bình", color: "amber" },
  { value: "Khó", label: "Khó", color: "rose" },
];

const LESSONS: Lesson[] = [
  { id: "lesson-001", name: "Giới thiệu về Programming" },
  { id: "lesson-002", name: "Variables và Data Types" },
  { id: "lesson-003", name: "Control Flow - If/Else" },
  { id: "lesson-004", name: "Loops - For và While" },
  { id: "lesson-005", name: "Functions và Methods" },
  { id: "lesson-006", name: "Arrays và Lists" },
  { id: "lesson-007", name: "String Manipulation" },
  { id: "lesson-008", name: "Object-Oriented Programming" },
  { id: "lesson-009", name: "Recursion" },
  { id: "lesson-010", name: "Algorithms - Sorting" },
];

const RETURN_TYPES = [
  "void",
  "int",
  "long",
  "float",
  "double",
  "boolean",
  "char",
  "string",
  "int[]",
  "string[]",
  "vector<int>",
  "vector<string>",
  "vector<vector<int>>",
  "Map<string, int>",
  "Set<int>",
  "Object",
  "any",
];

const TABS: TabItem[] = [
  { id: "basic", label: "Thông Tin Cơ Bản", icon: FileText },
  { id: "function", label: "Chi Tiết Function", icon: Code2 },
  { id: "limits", label: "Giới Hạn", icon: Settings },
  { id: "testcases", label: "Các Test Case", icon: TestTube },
];

const INITIAL_PROBLEM: Problem = {
  problemId: "",
  title: "",
  slug: "",
  difficulty: "Dễ",
  status: "NOT_STARTED",
  description: "",
  tags: "",
  functionName: "",
  parameters: "",
  returnType: "void",
  notes: "",
  constraints: "",
  timeLimit: 1000,
  memoryLimit: 256,
  lessonId: "",
};

const INITIAL_TEST_CASE: TestCase & { testCaseId?: string } = {
  testCaseId: "",
  input: [{ name: "", type: "int", value: "" }],
  expectedOutput: "",
  explain: "",
  isHidden: false,
};

const EditProblem: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // ========================================================================
  // STATES
  // ========================================================================
  const [loading, setLoading] = useState(true);
  const [problem, setProblem] = useState<Problem>(INITIAL_PROBLEM);
  const [testCases, setTestCases] = useState<
    (ProblemTestCase & { testCaseId?: string })[]
  >([INITIAL_TEST_CASE]);
  const [originalTestCases, setOriginalTestCases] = useState<
    (ProblemTestCase & { testCaseId?: string })[]
  >([]);
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [notification, setNotification] = useState<Notification | null>(null);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<{
    problem: Problem;
    testCases: ProblemTestCase[];
  } | null>(null);

  // ========================================================================
  // EFFECTS
  // ========================================================================

  /** Tải thông tin bài tập và test cases khi component mount */
  useEffect(() => {
    const loadProblemData = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const problemRes = await practiceService.getProblemBySlug(slug);
        const problemData = problemRes.data?.data;

        if (problemData) {
          // Ánh xạ độ khó từ API (Easy/Medium/Hard) thành UI (Dễ/Trung Bình/Khó)
          setProblem({
            problemId: problemData.problemId,
            title: problemData.title || "",
            slug: problemData.slug || "",
            difficulty: problemData.difficulty,
            status: problemData.status || "NOT_STARTED",
            description: problemData.description || "",
            tags: problemData.tags || "",
            functionName: problemData.functionName || "",
            parameters: problemData.parameters || "",
            returnType: problemData.returnType || "void",
            notes: problemData.notes || "",
            constraints: problemData.constraints || "",
            timeLimit: problemData.timeLimit || 1000,
            memoryLimit: problemData.memoryLimit || 256,
            lessonId: problemData.lessonId || "",
          });

          // Tải test cases
          if (problemData?.problemId) {
            try {
              const testCasesRes = await practiceService.getTestCaseOfProblem(
                problemData.problemId,
                null
              );
              let testCasesData = testCasesRes.data?.data;

              // Chuyển object thành array nếu cần
              if (testCasesData && !Array.isArray(testCasesData)) {
                testCasesData = Object.values(testCasesData);
              }

              if (Array.isArray(testCasesData) && testCasesData.length > 0) {
                const parsedTestCases = testCasesData.map(
                  (tc: Record<string, unknown>) => parseTestCase(tc)
                );
                setTestCases(parsedTestCases);
                setOriginalTestCases(parsedTestCases);
              }
            } catch (error) {
              console.error("Lỗi khi tải test cases:", error);
            }
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu bài tập:", error);
        setNotification({
          message: "Lỗi khi tải dữ liệu bài tập",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProblemData();
  }, [slug]);

  // ========================================================================
  // HELPER FUNCTIONS
  // ========================================================================

  /** Parse test case từ API response */
  const parseTestCase = (
    tc: Record<string, unknown>
  ): TestCase & { testCaseId?: string } => {
    let inputArray: Array<{ name: string; type: string; value: string }> = [];

    try {
      const inputStr = (tc.Input || tc.input) as
        | string
        | Record<string, unknown>;
      const inputObj =
        typeof inputStr === "string" ? JSON.parse(inputStr) : inputStr;
      inputArray = Object.entries(inputObj).map(([key, value]) => ({
        name: key,
        type: typeof value,
        value: String(value),
      }));
    } catch {
      inputArray = [
        { name: "", type: "string", value: String(tc.Input || tc.input) },
      ];
    }

    const testCaseId = (tc.TestCaseId || tc.testCaseId) as string;
    const validTestCaseId =
      testCaseId &&
      testCaseId !== "00000000-0000-0000-0000-000000000000" &&
      testCaseId.trim() !== ""
        ? testCaseId
        : "";

    return {
      input: inputArray,
      expectedOutput: (tc.ExpectedOutput || tc.expectedOutput || "") as string,
      explain: (tc.Explain || tc.explain || "") as string,
      isHidden: (tc.IsHidden || tc.isHidden || false) as boolean,
      testCaseId: validTestCaseId,
    };
  };

  /** Xử lý thay đổi thông tin bài tập */
  const handleProblemChange = (
    field: keyof Problem,
    value: string | number
  ) => {
    setProblem({ ...problem, [field]: value });

    // Tự động sinh slug từ title
    if (field === "title") {
      const newSlug = (value as string)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setProblem((prev) => ({ ...prev, slug: newSlug }));
    }

    // Xóa error khi user sửa field
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  /** Xác thực form */
  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!problem.title.trim()) newErrors.title = "Tiêu đề là bắt buộc";
    if (!problem.functionName.trim())
      newErrors.functionName = "Tên hàm là bắt buộc";
    if (!problem.description.trim())
      newErrors.description = "Mô tả là bắt buộc";

    const validTestCases = testCases.filter(
      (tc) => tc.input.some((v) => v.name && v.value) && tc.expectedOutput
    );

    if (validTestCases.length === 0) {
      newErrors.testCases = "Cần ít nhất 1 test case hợp lệ";
    }

    // Xác thực từng test case
    testCases.forEach((tc, index) => {
      const hasAnyVariable = tc.input.some((v) => v.name || v.value);
      if (hasAnyVariable) {
        tc.input.forEach((v, vIndex) => {
          if ((v.name && !v.value) || (!v.name && v.value)) {
            newErrors[`tc${index}var${vIndex}`] =
              "Tên biến và giá trị phải được điền đầy đủ";
          }
        });
        if (tc.input.some((v) => v.name && v.value) && !tc.expectedOutput) {
          newErrors[`tc${index}output`] =
            "Kết quả mong đợi là bắt buộc khi có input";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Hiển thị notification */
  const showNotificationMessage = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  /** Xóa test case qua callback từ TestCaseTab */
  const handleTestCaseDelete = async (testCaseId: string) => {
    console.log(testCaseId);
    // Kiểm tra testCaseId hợp lệ (không phải GUID rỗng)
    if (
      testCaseId &&
      testCaseId !== "00000000-0000-0000-0000-000000000000" &&
      testCaseId.trim() !== ""
    ) {
      try {
        await practiceService.deleteTestCase(testCaseId);
        showNotificationMessage("✓ Đã xóa test case thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa test case:", error);
        showNotificationMessage("Lỗi khi xóa test case", "error");
      }
    }
  };

  /** Auto-save khi cập nhật test case */
  const handleTestCaseUpdate = async (
    updatedTestCases: (ProblemTestCase & { testCaseId?: string })[]
  ) => {
    // Chỉ update những test case đã tồn tại (có testCaseId hợp lệ)
    for (let i = 0; i < originalTestCases.length; i++) {
      const original = originalTestCases[i];
      const current = updatedTestCases[i];

      if (!current || !current.testCaseId) {
        continue;
      }

      // Kiểm tra testCaseId hợp lệ
      if (
        current.testCaseId === "00000000-0000-0000-0000-000000000000" ||
        current.testCaseId.trim() === ""
      ) {
        continue;
      }

      // So sánh chỉ dữ liệu, không so sánh testCaseId
      const originalData = {
        input: original.input,
        expectedOutput: original.expectedOutput,
        isHidden: original.isHidden,
        explain: original.explain,
      };

      const currentData = {
        input: current.input,
        expectedOutput: current.expectedOutput,
        isHidden: current.isHidden,
        explain: current.explain,
      };

      if (JSON.stringify(originalData) !== JSON.stringify(currentData)) {
        try {
          console.log("Updating test case:", current.testCaseId);
          await practiceService.updateTestCase(current.testCaseId, {
            problemId: problem.problemId,
            input: current.input,
            expectedOutput: current.expectedOutput,
            isHidden: current.isHidden,
            explain: current.explain,
          });
          // Cập nhật originalTestCases để lần sau không update lại
          setOriginalTestCases((prev) => {
            const newOriginal = [...prev];
            newOriginal[i] = current;
            return newOriginal;
          });
          showNotificationMessage("✓ Đã cập nhật test case thành công!");
        } catch (error) {
          console.error("Lỗi khi cập nhật test case:", error);
          showNotificationMessage("Lỗi khi cập nhật test case", "error");
        }
      }
    }
  };

  /** Submit form - cập nhật bài tập */
  const handleSubmit = async () => {
    if (!validateForm()) {
      showNotificationMessage(
        "Vui lòng kiểm tra lại các trường bắt buộc!",
        "error"
      );
      return;
    }

    const data = generateSubmitData();

    try {
      // Cập nhật thông tin bài tập
      const updatedProblem = await practiceService.updateProblem(
        problem.problemId || "",
        data.problem
      );
      const problemId =
        updatedProblem?.problemId ?? updatedProblem?.ProblemId ?? null;

      // Xử lý test cases
      if (problemId) {
        // 1. Xử lý test cases: Nếu có testcaseId thì UPDATE, không có thì CREATE
        const updatePromises: Promise<void>[] = [];
        const createTestCases: Array<{
          problemId: string;
          input: (typeof testCases)[0]["input"];
          expectedOutput: string;
          isHidden: boolean;
          explain: string;
        }> = [];

        for (let i = 0; i < testCases.length; i++) {
          const testCase = testCases[i];

          // Bỏ qua test case không hợp lệ
          if (
            !Array.isArray(testCase.input) ||
            !testCase.input.some((v) => v.name && v.value) ||
            !testCase.expectedOutput
          ) {
            continue;
          }

          // Nếu có testcaseId hợp lệ: UPDATE
          if (
            testCase.testCaseId &&
            testCase.testCaseId !== "00000000-0000-0000-0000-000000000000" &&
            testCase.testCaseId.trim() !== ""
          ) {
            updatePromises.push(
              (async () => {
                try {
                  await practiceService.updateTestCase(testCase.testCaseId!, {
                    problemId,
                    input: testCase.input,
                    expectedOutput: testCase.expectedOutput,
                    isHidden: testCase.isHidden,
                    explain: testCase.explain,
                  });
                } catch (error) {
                  console.error(
                    `Lỗi khi cập nhật test case ${testCase.testCaseId}:`,
                    error
                  );
                  throw error;
                }
              })()
            );
          } else {
            // Nếu không có testcaseId hợp lệ: Thêm vào danh sách CREATE
            createTestCases.push({
              problemId,
              input: testCase.input,
              expectedOutput: testCase.expectedOutput,
              isHidden: testCase.isHidden,
              explain: testCase.explain,
            });
          }
        }

        // Thực hiện các update song song
        if (updatePromises.length > 0) {
          try {
            await Promise.all(updatePromises);
            console.log(`✓ Cập nhật ${updatePromises.length} test case`);
          } catch (error) {
            console.error("Lỗi khi cập nhật test cases:", error);
            showNotificationMessage("Lỗi khi cập nhật test case", "error");
          }
        }

        // Tạo test cases mới
        if (createTestCases.length > 0) {
          try {
            await practiceService.createTestCase(createTestCases);
            console.log(`✓ Tạo ${createTestCases.length} test case mới`);
          } catch (error) {
            console.error("Lỗi khi tạo test case mới:", error);
            showNotificationMessage("Lỗi khi tạo test case mới", "error");
          }
        }
      }

      setSubmittedData({
        problem: updatedProblem,
        testCases: data.testCases,
      });

      setShowResultModal(true);
      showNotificationMessage("✓ Dữ liệu đã cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật bài tập:", error);
      showNotificationMessage("Lỗi khi cập nhật bài tập", "error");
    }
  };

  /** Copy JSON vào clipboard */
  const copyToClipboard = () => {
    const data = generateSubmitData();
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    showNotificationMessage("Đã copy JSON vào clipboard!");
  };

  /** Download JSON */
  const downloadJSON = () => {
    const data = generateSubmitData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${problem.slug || "problem"}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotificationMessage("Đã tải xuống file JSON!");
  };

  /** Tạo dữ liệu submit - convert độ khó từ Việt sang Anh */
  const generateSubmitData = () => {
    return {
      problem: {
        ...problem,
        difficulty: problem.difficulty,
        lessonId: problem.lessonId === "" ? null : problem.lessonId,
        tags: problem.tags,
      },
      testCases: testCases
        .filter(
          (tc) =>
            Array.isArray(tc.input) &&
            tc.input.some((v) => v.name && v.value) &&
            tc.expectedOutput
        )
        .map((tc) => ({
          ...tc,
          input: tc.input.filter((v) => v.name && v.value),
        })),
    };
  };

  /** Làm mới form */
  const clearDraft = () => {
    if (confirm("Bạn có chắc muốn xóa tất cả thay đổi?")) {
      window.location.reload();
    }
  };

  /** Lấy màu sắc tương ứng với độ khó */
  const getDifficultyColor = (diff: string): string => {
    const option = DIFFICULTY_OPTIONS.find((opt) => opt.value === diff);
    return option ? option.color : "slate";
  };

  /** Tính số test case hợp lệ */
  const validTestCasesCount = testCases.filter(
    (tc) =>
      Array.isArray(tc.input) &&
      tc.input.some((v) => v.name && v.value) &&
      tc.expectedOutput
  ).length;

  // ========================================================================
  // RENDER
  // ========================================================================

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="page-add-problem coding-problem-form">
      {/* Notification */}
      {notification && (
        <div className={`notification notification--${notification.type}`}>
          {notification.type === "success" ? (
            <CheckCircle2 size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Result Modal */}
      <FormResultModal
        showResultModal={showResultModal}
        setShowResultModal={setShowResultModal}
        submittedData={submittedData}
        getDifficultyColor={getDifficultyColor}
        lessons={LESSONS}
        copyToClipboard={copyToClipboard}
        downloadJSON={downloadJSON}
      />

      <div className="container">
        {/* Header */}
        <div className="header">
          <div className="header__content">
            <div className="header__icon">
              <Code2 size={24} />
            </div>
            <div className="header__text">
              <h1>Chỉnh Sửa Bài Tập</h1>
              <p>Cập nhật bài tập lập trình</p>
            </div>
          </div>
          <div className="header__actions">
            <button onClick={() => navigate(-1)} className="btn btn--secondary">
              <ArrowLeft size={18} />
              <span className="btn__text--desktop">Quay lại</span>
            </button>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="btn btn--secondary"
            >
              <Eye size={18} />
              <span className="btn__text--desktop">Xem Trước JSON</span>
            </button>
            <button onClick={clearDraft} className="btn btn--secondary">
              <RefreshCw size={18} />
              <span className="btn__text--desktop">Làm Mới</span>
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="stats">
          <div className="stat-card">
            <div className="stat-card__label">Độ Khó</div>
            <div
              className={`stat-card__value stat-card__value--${getDifficultyColor(
                problem.difficulty
              )}`}
            >
              {problem.difficulty}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card__label">Test Cases</div>
            <div className="stat-card__value stat-card__value--indigo">
              {validTestCasesCount} / {testCases.length}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card__label">Giới Hạn Thời Gian</div>
            <div className="stat-card__value">{problem.timeLimit}ms</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__label">Giới Hạn Bộ Nhớ</div>
            <div className="stat-card__value">{problem.memoryLimit}MB</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="tabs">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab ${activeTab === tab.id ? "tab--active" : ""}`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="content-wrapper">
          {/* Main Content */}
          <div className="main-content">
            <div className="card">
              <BasicInfoTab
                activeTab={activeTab}
                problem={problem}
                handleProblemChange={handleProblemChange}
                errors={errors}
                getDifficultyColor={getDifficultyColor}
                difficultyOptions={DIFFICULTY_OPTIONS}
                lessons={LESSONS}
              />

              <FunctionDetailTab
                activeTab={activeTab}
                problem={problem}
                handleProblemChange={handleProblemChange}
                returnTypes={RETURN_TYPES}
              />

              <LimitTab
                activeTab={activeTab}
                problem={problem}
                handleProblemChange={handleProblemChange}
              />

              <TestCaseTab
                activeTab={activeTab}
                validTestCasesCount={validTestCasesCount}
                testCases={testCases}
                setTestCases={setTestCases}
                errors={errors}
                returnTypes={RETURN_TYPES}
                onTestCaseUpdate={handleTestCaseUpdate}
                onTestCaseDelete={handleTestCaseDelete}
              />

              {/* Action Buttons */}
              <div className="form-actions">
                <div className="form-actions__left">
                  <button onClick={clearDraft} className="btn btn--secondary">
                    <RefreshCw size={18} />
                    Làm Mới
                  </button>
                </div>
                <div className="form-actions__right">
                  <button
                    onClick={copyToClipboard}
                    className="btn btn--secondary"
                  >
                    <Copy size={18} />
                    Copy JSON
                  </button>
                  <button onClick={handleSubmit} className="btn btn--primary">
                    <CheckCircle2 size={20} />
                    Cập Nhật Bài Tập
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* JSON Preview Sidebar */}
          <div className={`sidebar ${showPreview ? "sidebar--visible" : ""}`}>
            <div className="preview-card">
              <div className="preview-card__header">
                <div className="preview-card__title">
                  <Code2 size={18} />
                  <span>Xem Trước JSON</span>
                </div>
                <div className="preview-card__actions">
                  <button
                    onClick={copyToClipboard}
                    className="btn btn--icon"
                    title="Sao chép vào clipboard"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={downloadJSON}
                    className="btn btn--icon"
                    title="Tải xuống JSON"
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>
              <div className="preview-card__body">
                <pre>{JSON.stringify(generateSubmitData(), null, 2)}</pre>
              </div>
            </div>

            {/* Quick Stats */}
            <QuickStats
              problem={problem}
              validTestCasesCount={validTestCasesCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProblem;
