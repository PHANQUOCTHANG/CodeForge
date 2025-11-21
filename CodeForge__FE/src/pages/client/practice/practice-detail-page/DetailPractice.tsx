import { useState, useRef, useEffect, useCallback } from "react";
import Editor from "@monaco-editor/react";
import "./DetailPractice.scss";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "@/common/helper/Loading";

import type { CodingProblem } from "@/features";

import { ArrowLeft } from "lucide-react";

import SubmitModal from "@/features/practice/components/submit-modal/SubmitModal";
import ResultDetailsRaw from "@/features/practice/components/result-detail/ResultDetail";
import { Spin } from "antd";
import SubmissionsTab from "@/features/practice/components/submission/SubmissionTab";
import practiceService from "@/features/practice/services/practiceService";
import {
  clampValue,
  parseTestCaseInput,
  readNumber,
} from "@/features/practice/utils";
import type {
  Language,
  SubmitResult,
  TestCase,
  TestResult,
} from "@/features/practice/types";
import { generateFunctionTemplate } from "@/features/practice/utils/generateFunctionTemplate";
import test from "node:test";

// Type casting for compatibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ResultDetails = ResultDetailsRaw as unknown as React.FC<any>;

// Layout Constants
const LAYOUT_CONFIG = {
  DEFAULT_LEFT_WIDTH: 45,
  DEFAULT_EDITOR_HEIGHT: 65,
  MIN_PANEL_WIDTH: 20,
  MAX_PANEL_WIDTH: 80,
  MIN_EDITOR_HEIGHT: 20,
  MAX_EDITOR_HEIGHT: 90,
} as const;

// UI Constants
const UI_CONFIG = {
  DEFAULT_THEME: "vs-dark" as const,
  DEFAULT_LANGUAGE: "cpp" as const,
} as const;

// Hardcoded userId (should be moved to context/state management)
const DUMMY_USER_ID = "f452f361-bcde-405a-afe0-3d404e37d319";
const DetailPractice: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams() || "";

  // Core Data State
  const [problem, setProblem] = useState<CodingProblem | null>(null);
  const [loading, setLoading] = useState(true);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [testResults, setTestResults] = useState<TestResult[] | []>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log("Test Results:", testResults, problem, testCases);
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    isSuccess: false,
    passedTests: 0,
    totalTests: 0,
    status: "Accepted",
    message: "",
    runtime: "N/A",
    memory: "N/A",
  });

  // UI State - Layout
  const [leftWidthPercent, setLeftWidthPercent] = useState<number>(() =>
    readNumber("cf_leftWidthPercent", LAYOUT_CONFIG.DEFAULT_LEFT_WIDTH)
  );
  const [editorHeightPercent, setEditorHeightPercent] = useState<number>(() =>
    readNumber("cf_editorHeightPercent", LAYOUT_CONFIG.DEFAULT_EDITOR_HEIGHT)
  );

  // UI State - Tabs
  const [activeTab, setActiveTab] = useState("description");
  const [testcaseTab, setTestcaseTab] = useState("testcase");
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  // Editor State
  const [theme, setTheme] = useState<"vs" | "vs-dark">(
    () =>
      (localStorage.getItem("cf_theme") as "vs" | "vs-dark") ||
      UI_CONFIG.DEFAULT_THEME
  );

  // Programming language for editor
  const [language, setLanguage] = useState<Language>(
    UI_CONFIG.DEFAULT_LANGUAGE
  );
  const [code, setCode] = useState<string>("");

  // Refs
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rightPanelRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const isDraggingHorizontalRef = useRef(false);

  // Derived State
  const currentCase = testCases.find((c) => c.testCaseId === selectedCaseId);

  const [passedCount, setPassedCount] = useState(
    testResults?.filter((r) => r.status === "Accepted").length || 0
  );
  const [totalCount, setTotalCount] = useState(testResults?.length || 0);
  const selectedResult = testResults?.find(
    (r) => r.testCaseId === selectedCaseId
  );

  // Lấy dữ liệu bài toán theo slug
  const fetchProblem = useCallback(async () => {
    try {
      const response = await practiceService.getProblemBySlug(slug || "");
      const problem = response.data.data;
      setProblem(problem);
      return problem?.problemId;
    } catch (error) {
      console.error("Failed to fetch problem:", error);
      return null;
    }
  }, [slug]);

  const fetchTestCases = useCallback(
    async (problemId: string) => {
      try {
        const response = await practiceService.getTestCaseOfProblem(problemId);
        const data = response?.data?.data;

        if (!data) return;

        const mapped = data.map(
          (item: TestCase, idx: number): TestCase => ({
            ...item,
            input: parseTestCaseInput(item.input),
            name: `Case ${idx + 1}`,
          })
        );

        setTestCases(mapped);
        if (mapped.length > 0 && !selectedCaseId) {
          setSelectedCaseId(mapped[0].testCaseId);
        }
      } catch (err) {
        console.error("Failed to load test cases:", err);
      }
    },
    [selectedCaseId]
  );

  useEffect(() => {
    const loadData = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        const problemId = await fetchProblem();
        if (problemId) {
          await fetchTestCases(problemId);
        }
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug, fetchProblem, fetchTestCases]);

  useEffect(() => {
    if (problem) {
      setCode(generateFunctionTemplate(problem, language));
    }
  }, [problem, language]);

  useEffect(() => {
    try {
      localStorage.setItem("cf_leftWidthPercent", String(leftWidthPercent));
      localStorage.setItem(
        "cf_editorHeightPercent",
        String(editorHeightPercent)
      );
      localStorage.setItem("cf_language", language);
      localStorage.setItem("cf_theme", theme);
    } catch (err) {
      console.error("Failed to save to localStorage:", err);
    }
  }, [leftWidthPercent, editorHeightPercent, language, theme]);

  // Xử lý kéo thả thay đổi kích thước panel dọc (trái/phải)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = clampValue(
        (x / rect.width) * 100,
        LAYOUT_CONFIG.MIN_PANEL_WIDTH,
        LAYOUT_CONFIG.MAX_PANEL_WIDTH
      );
      setLeftWidthPercent(percent);
    };

    const handleMouseUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      containerRef.current?.classList.remove("dragging");
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (
        !isDraggingRef.current ||
        !containerRef.current ||
        e.touches.length === 0
      )
        return;
      const touch = e.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const percent = clampValue(
        (x / rect.width) * 100,
        LAYOUT_CONFIG.MIN_PANEL_WIDTH,
        LAYOUT_CONFIG.MAX_PANEL_WIDTH
      );
      setLeftWidthPercent(percent);
      e.preventDefault();
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      containerRef.current?.classList.remove("dragging");
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingHorizontalRef.current || !rightPanelRef.current) return;
      const rect = rightPanelRef.current.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const percent = clampValue(
        (y / rect.height) * 100,
        LAYOUT_CONFIG.MIN_EDITOR_HEIGHT,
        LAYOUT_CONFIG.MAX_EDITOR_HEIGHT
      );
      setEditorHeightPercent(percent);
    };

    const handleMouseUp = () => {
      if (!isDraggingHorizontalRef.current) return;
      isDraggingHorizontalRef.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      rightPanelRef.current?.classList.remove("dragging-horizontal");
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (
        !isDraggingHorizontalRef.current ||
        !rightPanelRef.current ||
        e.touches.length === 0
      )
        return;
      const touch = e.touches[0];
      const rect = rightPanelRef.current.getBoundingClientRect();
      const y = touch.clientY - rect.top;
      const percent = clampValue(
        (y / rect.height) * 100,
        LAYOUT_CONFIG.MIN_EDITOR_HEIGHT,
        LAYOUT_CONFIG.MAX_EDITOR_HEIGHT
      );
      setEditorHeightPercent(percent);
      e.preventDefault();
    };

    const handleTouchEnd = () => {
      isDraggingHorizontalRef.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      rightPanelRef.current?.classList.remove("dragging-horizontal");
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  const handleEditorChange = (value?: string | null) => {
    setCode(value || "");
  };

  const handleRun = async () => {
    if (!problem) return;

    setIsTesting(true);
    setTestcaseTab("result");

    try {
      const response = await practiceService.runTest({
        userId: DUMMY_USER_ID,
        problemId: problem.problemId,
        language,
        functionName: problem.functionName,
        code,
        testCases: testCases.map((t) => t.testCaseId),
      });

      const formattedResults = response.data.data.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (item: any, idx: number) => ({
          testCaseId: item.testCaseId,
          name: `Case ${idx + 1}`,
          status: item.status?.description || item.status,
          actualOutput: item.stdout || item.actualOutput,
          expectedOutput: item.expectedOutput,
          passed: item.passed,
          executionTime: item.time,
          memoryUsage: (item.memory / 1024).toFixed(2),
          input: item.input,
          explain: item.explain,
        })
      );

      setTestResults(formattedResults);
      if (formattedResults.length > 0) {
        setSelectedCaseId(formattedResults[0].testCaseId);
      }
    } catch (error) {
      console.error("Run test failed:", error);
      alert("Failed to run test. Please try again.");
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = async () => {
    if (!problem) {
      alert("Problem data is not loaded");
      return;
    }

    if (!code?.trim()) {
      alert("Please write your code before submitting");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await practiceService.submitProblem({
        userId: DUMMY_USER_ID,
        problemId: problem.problemId,
        language,
        functionName: problem.functionName,
        code,
      });

      const result: SubmitResult = response.data.data;
      console.log(result);
      setModalData({
        isSuccess: !!result.submit,
        passedTests: result.testCasePass ?? 0,
        totalTests: result.totalTestCase ?? 0,
        status: result.status ?? "Unknown",
        message: result.message ?? "No message",
        runtime: `${result.time ?? 0}s`,
        memory: result.memory
          ? `${(result.memory / 1024).toFixed(2)}MB`
          : "0MB",
      });

      setShowModal(true);

      if (result.resultFail) {
        setTestcaseTab("result");

        const dataResult = [];
        dataResult.push(result.resultFail);

        const formattedResults = dataResult.map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (item: any, idx: number) => ({
            testCaseId: item.testCaseId,
            name: `Case ${idx + 1}`,
            status: item.status?.description || item.status,
            actualOutput: item.stdout || item.actualOutput,
            expectedOutput: item.expectedOutput,
            passed: item.passed,
            executionTime: item.time,
            memoryUsage: (item.memory / 1024).toFixed(2),
            input: item.input,
            explain: item.explain,
          })
        );

        setPassedCount(result.testCasePass);
        setTotalCount(result.totalTestCase);

        setTestResults(formattedResults as unknown as TestResult[]);
      }
    } catch (error) {
      console.error("Submit failed:", error);
      alert("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as Language;
    setLanguage(newLang);
    if (problem) {
      setCode(generateFunctionTemplate(problem, newLang));
    }
    setTestResults([]);
  };

  // Bắt đầu kéo thanh chia dọc
  const handleDividerMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    containerRef.current?.classList.add("dragging");
    e.preventDefault();
  };

  // Bắt đầu kéo thanh chia dọc (touch)
  const handleDividerTouchStart = (e: React.TouchEvent) => {
    isDraggingRef.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    containerRef.current?.classList.add("dragging");
    e.preventDefault();
  };

  // Điều chỉnh thanh chia dọc bằng phím mũi tên
  const handleDividerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setLeftWidthPercent((p) =>
        clampValue(
          p - 2,
          LAYOUT_CONFIG.MIN_PANEL_WIDTH,
          LAYOUT_CONFIG.MAX_PANEL_WIDTH
        )
      );
    } else if (e.key === "ArrowRight") {
      setLeftWidthPercent((p) =>
        clampValue(
          p + 2,
          LAYOUT_CONFIG.MIN_PANEL_WIDTH,
          LAYOUT_CONFIG.MAX_PANEL_WIDTH
        )
      );
    }
  };

  // Bắt đầu kéo thanh chia ngang
  const handleHDividerMouseDown = (e: React.MouseEvent) => {
    isDraggingHorizontalRef.current = true;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
    rightPanelRef.current?.classList.add("dragging-horizontal");
    e.preventDefault();
  };

  // Bắt đầu kéo thanh chia ngang (touch)
  const handleHDividerTouchStart = (e: React.TouchEvent) => {
    isDraggingHorizontalRef.current = true;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
    rightPanelRef.current?.classList.add("dragging-horizontal");
    e.preventDefault();
  };

  // Điều chỉnh thanh chia ngang bằng phím mũi tên
  const handleHDividerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      setEditorHeightPercent((p) =>
        clampValue(
          p - 2,
          LAYOUT_CONFIG.MIN_EDITOR_HEIGHT,
          LAYOUT_CONFIG.MAX_EDITOR_HEIGHT
        )
      );
    } else if (e.key === "ArrowDown") {
      setEditorHeightPercent((p) =>
        clampValue(
          p + 2,
          LAYOUT_CONFIG.MIN_EDITOR_HEIGHT,
          LAYOUT_CONFIG.MAX_EDITOR_HEIGHT
        )
      );
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!problem) {
    return null;
  }

  return (
    <>
      <Spin spinning={isSubmitting} fullscreen tip="Submitting..." />
      <SubmitModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isSuccess={modalData.isSuccess}
        problemTitle={problem?.title || ""}
        passedTests={modalData.passedTests}
        totalTests={modalData.totalTests}
        runtime={modalData.runtime}
        memory={modalData.memory}
        status={modalData.status}
      />

      <div
        className="detail-practice-container"
        ref={containerRef}
        style={{ userSelect: isDraggingRef.current ? "none" : undefined }}
      >
        {/* BÊN TRÁI */}
        <div
          className="left-panel"
          style={{ width: `${leftWidthPercent}%`, minWidth: "20%" }}
        >
          <div className="panel-header">
            <button className="btn-back" onClick={() => navigate("/practice")}>
              <ArrowLeft />
            </button>
            <div
              className={`tab ${activeTab === "description" ? "active" : ""}`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </div>
            {/* <div
              className={`tab ${activeTab === "editorial" ? "active" : ""}`}
              onClick={() => setActiveTab("editorial")}
            >
              Editorial
            </div>
            <div
              className={`tab ${activeTab === "solutions" ? "active" : ""}`}
              onClick={() => setActiveTab("solutions")}
            >
              Solutions
            </div> */}
            <div
              className={`tab ${activeTab === "submissions" ? "active" : ""}`}
              onClick={() => setActiveTab("submissions")}
            >
              Submissions
            </div>
          </div>
          <div className="panel-content">
            {activeTab === "description" && (
              <div>
                <h1 className="problem-title">{problem.title}</h1>
                <div className="problem-meta">
                  <span className="difficulty easy">Easy</span>
                  <span className="tag">Array</span>
                  <span className="tag">Hash Table</span>
                </div>
                <div className="problem-description">
                  <p>{problem.description}</p>
                  {testCases.slice(0, 3).map((testCase, idx) => (
                    <div className="example" key={testCase.testCaseId}>
                      <div className="example-title">Example {idx + 1}:</div>
                      <pre>
                        {`Input: ${
                          typeof testCase.input === "object"
                            ? Object.entries(testCase.input || "")
                                .map(
                                  ([k, v]) =>
                                    `${k} = ${
                                      typeof v === "string"
                                        ? v
                                        : JSON.stringify(v)
                                    }`
                                )
                                .join(", ")
                            : String(testCase.input)
                        }\n`}
                        {`Output: ${testCase.expectedOutput}\n`}
                        {testCase.explain
                          ? `Explanation: ${testCase.explain}`
                          : ""}
                      </pre>
                    </div>
                  ))}
                  {problem.constraints && (
                    <div className="constraints">
                      <div className="constraints-title">Constraints:</div>
                      <ul>
                        {problem.constraints
                          .split(";")
                          .map(
                            (item, idx) => item && <li key={idx}>{item}</li>
                          )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab == "submissions" && (
              <SubmissionsTab
                problemId={problem.problemId}
                userId="f452f361-bcde-405a-afe0-3d404e37d319"
              ></SubmissionsTab>
            )}
          </div>
        </div>

        {/* THANH NGĂN DỌC */}
        <div
          className="divider"
          onMouseDown={handleDividerMouseDown}
          onTouchStart={handleDividerTouchStart}
          onKeyDown={handleDividerKeyDown}
          role="separator"
          tabIndex={0}
          aria-orientation="vertical"
          aria-label="Resize panels. Use mouse or Arrow keys."
        />

        {/* BÊN PHẢI */}
        <div
          className="right-panel"
          style={{ width: `${100 - leftWidthPercent}%`, minWidth: "20%" }}
          ref={rightPanelRef}
        >
          <div className="editor-header">
            <div className="editor-controls">
              <select
                className="language-select"
                value={language}
                onChange={handleLanguageChange}
                aria-label="Select programming language"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
              </select>
              <button
                className="theme-toggle"
                onClick={() =>
                  setTheme((t) => (t === "vs-dark" ? "vs" : "vs-dark"))
                }
                aria-pressed={theme === "vs-dark"}
                aria-label="Toggle editor theme"
              >
                {theme === "vs-dark" ? "☀️" : "🌙"}
              </button>
            </div>
            <div className="action-buttons">
              <button
                className="btn btn-run"
                onClick={handleRun}
                disabled={isTesting || isSubmitting}
              >
                {isTesting ? (
                  <div className="loading-animation"></div>
                ) : (
                  <>▶ Run</>
                )}
              </button>
              <button
                className="btn btn-submit"
                onClick={handleSubmit}
                disabled={isTesting || isSubmitting}
              >
                Submit
              </button>
            </div>
          </div>

          <div
            className="editor-wrapper"
            style={{ height: `calc(${editorHeightPercent}% - 1px)` }}
          >
            <Editor
              height="100%"
              language={language}
              theme={theme}
              value={code}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: true },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: "on",
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
                parameterHints: { enabled: true },
              }}
            />
          </div>

          {/* THANH NGĂN NGANG */}
          <div
            className="h-divider"
            onMouseDown={handleHDividerMouseDown}
            onTouchStart={handleHDividerTouchStart}
            onKeyDown={handleHDividerKeyDown}
            role="separator"
            tabIndex={0}
            aria-orientation="horizontal"
            aria-label="Resize editor and testcase. Use mouse or Arrow keys."
          />

          {/* BẢNG TESTCASE */}
          <div
            className="testcase-panel"
            style={{ height: `calc(${100 - editorHeightPercent}% - 1px)` }}
          >
            <div className="testcase-header">
              <div className="testcase-tabs">
                <div
                  className={`testcase-tab ${
                    testcaseTab === "testcase" ? "active" : ""
                  }`}
                  onClick={() => setTestcaseTab("testcase")}
                >
                  Testcase
                </div>
                <div
                  className={`testcase-tab ${
                    testcaseTab === "result" ? "active" : ""
                  }`}
                  onClick={() => setTestcaseTab("result")}
                >
                  Test Result
                  {testResults && (
                    <span
                      style={{
                        marginLeft: "8px",
                        padding: "2px 8px",
                        background:
                          passedCount === totalCount ? "#00b8a3" : "#ef476f",
                        color: "white",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: "700",
                      }}
                    >
                      {passedCount}/{totalCount}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {testcaseTab === "testcase" && (
              <div className="testcase-content">
                <div className="case-selector">
                  {testCases.map((caseItem) => (
                    <div
                      key={caseItem.testCaseId}
                      className={`case-item ${
                        selectedCaseId === caseItem.testCaseId ? "active" : ""
                      }`}
                      onClick={() => setSelectedCaseId(caseItem.testCaseId)}
                    >
                      {caseItem.name}
                    </div>
                  ))}
                </div>

                <div className="testcase-inputs">
                  {currentCase && (
                    <>
                      {currentCase.input &&
                      typeof currentCase.input === "object" &&
                      !Array.isArray(currentCase.input) ? (
                        Object.entries(currentCase.input).map(([k, v]) => (
                          <div className="input-group" key={k}>
                            <label className="input-label">{k} =</label>
                            <div className="input-value">
                              {typeof v === "string" ? v : JSON.stringify(v)}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="input-group">
                          <label className="input-label">input =</label>
                          <div className="input-value">
                            {String(currentCase.input)}
                          </div>
                        </div>
                      )}

                      <div className="input-group">
                        <label className="input-label">Expected =</label>
                        <div className="input-value">
                          {currentCase.expectedOutput}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {testcaseTab === "result" && (
              <div className="testcase-content">
                {isTesting && (
                  <div className="result-placeholder">
                    <div className="loading-animation"></div>
                    <div className="result-text">Running your code...</div>
                  </div>
                )}

                {!isTesting && testResults && (
                  <>
                    <div className="case-selector">
                      {testResults.map((result) => (
                        <div
                          key={result.testCaseId}
                          className={`case-item ${
                            selectedCaseId === result.testCaseId ? "active" : ""
                          } ${
                            result.status === "Accepted"
                              ? "case-passed"
                              : "case-failed"
                          }`}
                          onClick={() => setSelectedCaseId(result.testCaseId)}
                        >
                          {result.name}{" "}
                          {result.status === "Accepted" ? "✓" : "✗"}
                        </div>
                      ))}
                    </div>

                    {selectedResult && (
                      <div
                        className={`test-case-summary ${
                          selectedResult.status === "Accepted"
                            ? "accepted"
                            : "wrong-answer"
                        }`}
                      >
                        <span>{selectedResult.status}</span>
                        <div className="summary-stats">
                          <span>Runtime: {selectedResult.executionTime}s</span>
                          <span>Memory: {selectedResult.memoryUsage}MB</span>
                        </div>
                      </div>
                    )}

                    <ResultDetails
                      result={selectedResult}
                      testCase={testCases.find(
                        (item) => item.testCaseId === selectedCaseId
                      )}
                    />
                  </>
                )}

                {!isTesting && !testResults && (
                  <div className="result-placeholder">
                    <div className="result-icon">▶</div>
                    <div className="result-text">
                      Click Run to see the output
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailPractice;
