// CodingProblemForm.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import "./AddProblem.scss";
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

const CodingProblemForm: React.FC = ({ problemId }) => {
  const [problem, setProblem] = useState<Problem>({
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

  const [testCases, setTestCases] = useState<TestCase[]>([
    {
      input: [{ name: "", type: "int", value: "" }],
      expectedOutput: "",
      explain: "",
      isHidden: false,
    },
  ]);

  const [activeTab, setActiveTab] = useState<string>("basic");
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [notification, setNotification] = useState<Notification | null>(null);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<{
    problem: Problem;
    testCases: ProblemTestCase[];
  } | null>(null);

  const navigate = useNavigate();

  // Auto-save to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("codingProblemDraft");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setProblem(parsed.problem);
        setTestCases(parsed.testCases);
      } catch (e) {
        console.error("Failed to load draft:", e);
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(
        "codingProblemDraft",
        JSON.stringify({ problem, testCases })
      );
    }, 1000);
    return () => clearTimeout(timer);
  }, [problem, testCases]);

  const handleProblemChange = (
    field: keyof Problem,
    value: string | number
  ) => {
    setProblem({ ...problem, [field]: value });

    if (field === "title") {
      const slug = (value as string)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setProblem((prev) => ({ ...prev, slug }));
    }

    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!problem.title.trim()) {
      newErrors.title = "Title là bắt buộc";
    }

    if (!problem.functionName.trim()) {
      newErrors.functionName = "FunctionName là bắt buộc";
    }

    if (!problem.description.trim()) {
      newErrors.description = "Description là bắt buộc";
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
            "Expected output là bắt buộc khi có input";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showNotification = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showNotification("Vui lòng kiểm tra lại các trường bắt buộc!", "error");
      return;
    }

    const data = generateSubmitData();
    console.log("Data to submit:", data.problem);
    console.log("TestCase of data:", data.testCases);

    // 1) Create problem first and get created id
    const createdProblem = await practiceService.createProblem(data.problem);
    const problemId =
      createdProblem?.problemId ?? createdProblem?.ProblemId ?? null;

    // 2) Prepare test case DTOs with ProblemId
    if (
      problemId &&
      Array.isArray(data.testCases) &&
      data.testCases.length > 0
    ) {
      const testCasePayload = data.testCases.map((tc) => ({
        problemId,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        isHidden: tc.isHidden,
        explain: tc.explain,
      }));

      await practiceService.createTestCase(testCasePayload);
      // set submittedData to include created problem id and original testcases
      setSubmittedData({ problem: createdProblem, testCases: data.testCases });
    } else {
      // no testcases to create - still set submitted data with problem
      setSubmittedData({ problem: createdProblem, testCases: [] });
    }
    setShowResultModal(true);
    showNotification("✓ Dữ liệu đã sẵn sàng! Kiểm tra kết quả bên dưới.");
  };

  const copyToClipboard = () => {
    const data = generateSubmitData();
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    showNotification("Đã copy JSON vào clipboard!");
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
    showNotification("Đã tải xuống file JSON!");
  };

  const generateSubmitData = () => {
    return {
      problem: {
        ...problem,
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
    if (confirm("Bạn có chắc muốn xóa toàn bộ dữ liệu?")) {
      localStorage.removeItem("codingProblemDraft");
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
              <h1>Thêm Bài Tập</h1>
              <p>Tạo bài tập lập trình mới cho học viên</p>
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
              <span className="btn__text--desktop">Reset</span>
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
            <div className="stat-card__label">Các Test Case</div>
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
                    Hủy Bỏ
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
                    Lưu Bài Tập
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
                    title="Copy to clipboard"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={downloadJSON}
                    className="btn btn--icon"
                    title="Download JSON"
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

export default CodingProblemForm;
