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

const EditProblem: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [problem, setProblem] = useState<Problem>({
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
  });

  const difficultyOptions: DifficultyOption[] = [
    { value: "Dễ", label: "Dễ", color: "emerald" },
    { value: "Trung Bình", label: "Trung Bình", color: "amber" },
    { value: "Khó", label: "Khó", color: "rose" },
  ];

  const lessons: Lesson[] = [
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

  const returnTypes: string[] = [
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

  const [testCases, setTestCases] = useState<(TestCase & { testCaseId?: string })[]>([
    {
      input: [{ name: "", type: "int", value: "" }],
      expectedOutput: "",
      explain: "",
      isHidden: false,
    },
  ]);

  const [originalTestCases, setOriginalTestCases] = useState<(TestCase & { testCaseId?: string })[]>([]);
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [notification, setNotification] = useState<Notification | null>(null);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<{
    problem: Problem;
    testCases: ProblemTestCase[];
  } | null>(null);

  // Load problem data on component mount
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

        console.log(problemData);

        if (problemData) {
          // Map API response to Problem type, handle both Easy/Medium/Hard and Dễ/Trung Bình/Khó
          const difficultyMap: Record<string, string> = {
            Easy: "Dễ",
            Medium: "Trung Bình",
            Hard: "Khó",
            Dễ: "Dễ",
            "Trung Bình": "Trung Bình",
            Khó: "Khó",
          };

          setProblem({
            problemId: problemData.problemId,
            title: problemData.title || "",
            slug: problemData.slug || "",
            difficulty:
              difficultyMap[problemData.difficulty] ||
              problemData.difficulty ||
              "Dễ",
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
        }

        // Load test cases
        if (problemData?.problemId) {
          try {
            const testCasesRes = await practiceService.getTestCaseOfProblem(
              problemData.problemId
            );
            let testCasesData = testCasesRes.data?.data;

            console.log("Test cases response:", testCasesRes);
            console.log("Test cases data:", testCasesData);
            console.log("Is array?", Array.isArray(testCasesData));
            console.log("Length:", testCasesData?.length);

            // Convert to array if needed
            if (testCasesData && !Array.isArray(testCasesData)) {
              testCasesData = Object.values(testCasesData);
            }

            if (Array.isArray(testCasesData) && testCasesData.length > 0) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const parsedTestCases = testCasesData.map((tc: any) => {
                let inputArray: Array<{
                  name: string;
                  type: string;
                  value: string;
                }> = [];

                try {
                  // Handle both 'Input' and 'input' property names
                  const inputStr = tc.Input || tc.input;
                  const inputObj =
                    typeof inputStr === "string"
                      ? JSON.parse(inputStr)
                      : inputStr;
                  inputArray = Object.entries(inputObj).map(([key, value]) => ({
                    name: key,
                    type: typeof value, // Simplified type detection
                    value: String(value),
                  }));
                } catch {
                  inputArray = [
                    {
                      name: "",
                      type: "string",
                      value: String(tc.Input || tc.input),
                    },
                  ];
                }

                return {
                  input: inputArray,
                  expectedOutput: tc.ExpectedOutput || tc.expectedOutput || "",
                  explain: tc.Explain || tc.explain || "",
                  isHidden: tc.IsHidden || tc.isHidden || false,
                  testCaseId: tc.TestCaseId || tc.testCaseId, // Store testCaseId for tracking
                };
              });

              console.log("Parsed test cases:", parsedTestCases);
              setTestCases(parsedTestCases);
              setOriginalTestCases(parsedTestCases);
            }
          } catch (testCasesError) {
            console.error("Lỗi khi tải test cases:", testCasesError);
            console.error("Chi tiết lỗi:", testCasesError);
            // Continue without test cases if error occurs
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

  const handleProblemChange = (
    field: keyof Problem,
    value: string | number
  ) => {
    setProblem({ ...problem, [field]: value });

    if (field === "title") {
      const newSlug = (value as string)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setProblem((prev) => ({ ...prev, slug: newSlug }));
    }

    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!problem.title.trim()) {
      newErrors.title = "Tiêu đề là bắt buộc";
    }

    if (!problem.functionName.trim()) {
      newErrors.functionName = "Tên hàm là bắt buộc";
    }

    if (!problem.description.trim()) {
      newErrors.description = "Mô tả là bắt buộc";
    }

    const validTestCases = testCases.filter(
      (tc) => tc.input.some((v) => v.name && v.value) && tc.expectedOutput
    );

    if (validTestCases.length === 0) {
      newErrors.testCases = "Cần ít nhất 1 test case hợp lệ";
    }

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

  const showNotificationMessage = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showNotificationMessage(
        "Vui lòng kiểm tra lại các trường bắt buộc!",
        "error"
      );
      return;
    }

    const data = generateSubmitData();
    console.log("Data to update:", data.problem);
    console.log("TestCases of data:", data.testCases);

    try {
      // Update problem
      const updatedProblem = await practiceService.updateProblem(
        problem.problemId || "",
        data.problem
      );
      const problemId =
        updatedProblem?.problemId ?? updatedProblem?.ProblemId ?? null;

      // Handle test cases: update existing, delete removed, create new
      if (problemId) {
        // 1. Delete test cases that were removed
        // If testCases.length < originalTestCases.length, some were deleted
        if (testCases.length < originalTestCases.length) {
          for (let i = testCases.length; i < originalTestCases.length; i++) {
            const deletedTestCase = originalTestCases[i];
            if (deletedTestCase.testCaseId) {
              try {
                await practiceService.deleteTestCase(deletedTestCase.testCaseId);
                console.log(`Deleted test case: ${deletedTestCase.testCaseId}`);
              } catch (e) {
                console.error(
                  `Failed to delete test case ${deletedTestCase.testCaseId}:`,
                  e
                );
              }
            }
          }
        }

        // 2. Update existing test cases that were modified
        for (let i = 0; i < Math.min(originalTestCases.length, testCases.length); i++) {
          const current = testCases[i];
          const testCaseId = current.testCaseId;

          console.log(`Test case ${i}: ID = ${testCaseId}`);

          // Only update if it has an ID (meaning it was from API)
          if (testCaseId) {
            try {
              await practiceService.updateTestCase(testCaseId, {
                input: current.input,
                expectedOutput: current.expectedOutput,
                isHidden: current.isHidden,
                explain: current.explain,
              });
              console.log(`Updated test case: ${testCaseId}`);
            } catch (e) {
              console.error(`Failed to update test case ${testCaseId}:`, e);
            }
          }
        }

        // 3. Create new test cases
        const newTestCases = testCases.filter(
          (tc, index) => index >= originalTestCases.length && !tc.testCaseId
        );

        if (newTestCases.length > 0) {
          const testCasePayload = newTestCases.map((tc) => ({
            problemId,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            isHidden: tc.isHidden,
            explain: tc.explain,
          }));

          await practiceService.createTestCase(testCasePayload);
          console.log(`Created ${newTestCases.length} new test cases`);
        }

        setSubmittedData({
          problem: updatedProblem,
          testCases: data.testCases,
        });
      } else {
        setSubmittedData({ problem: updatedProblem, testCases: [] });
      }

      setShowResultModal(true);
      showNotificationMessage("✓ Dữ liệu đã cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật bài tập:", error);
      showNotificationMessage("Lỗi khi cập nhật bài tập", "error");
    }
  };

  const copyToClipboard = () => {
    const data = generateSubmitData();
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    showNotificationMessage("Đã copy JSON vào clipboard!");
  };

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

  const generateSubmitData = () => {
    // Convert Vietnamese difficulty back to English for API
    const difficultyMapReverse: Record<string, string> = {
      Dễ: "Easy",
      "Trung Bình": "Medium",
      Khó: "Hard",
    };

    return {
      problem: {
        ...problem,
        difficulty:
          difficultyMapReverse[problem.difficulty] || problem.difficulty,
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

  const clearDraft = () => {
    if (confirm("Bạn có chắc muốn xóa tất cả thay đổi?")) {
      window.location.reload();
    }
  };

  const getDifficultyColor = (diff: string): string => {
    const option = difficultyOptions.find((opt) => opt.value === diff);
    return option ? option.color : "slate";
  };

  const tabs: TabItem[] = [
    { id: "basic", label: "Thông Tin Cơ Bản", icon: FileText },
    { id: "function", label: "Chi Tiết Function", icon: Code2 },
    { id: "limits", label: "Giới Hạn", icon: Settings },
    { id: "testcases", label: "Các Test Case", icon: TestTube },
  ];

  const validTestCasesCount = testCases.filter(
    (tc) =>
      Array.isArray(tc.input) &&
      tc.input.some((v) => v.name && v.value) &&
      tc.expectedOutput
  ).length;

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
        lessons={lessons}
        copyToClipboard={copyToClipboard}
        downloadJSON={downloadJSON}
      ></FormResultModal>

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
          {tabs.map((tab) => {
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
                difficultyOptions={difficultyOptions}
                lessons={lessons}
              ></BasicInfoTab>

              <FunctionDetailTab
                activeTab={activeTab}
                problem={problem}
                handleProblemChange={handleProblemChange}
                returnTypes={returnTypes}
              ></FunctionDetailTab>

              <LimitTab
                activeTab={activeTab}
                problem={problem}
                handleProblemChange={handleProblemChange}
              ></LimitTab>

              <TestCaseTab
                activeTab={activeTab}
                validTestCasesCount={validTestCasesCount}
                testCases={testCases}
                setTestCases={setTestCases}
                errors={errors}
                returnTypes={returnTypes}
              ></TestCaseTab>

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
            ></QuickStats>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProblem;
