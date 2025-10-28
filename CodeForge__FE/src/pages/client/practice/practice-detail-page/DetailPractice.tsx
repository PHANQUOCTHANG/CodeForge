import React, { useState, useCallback, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import "./DetailPractice.scss";
import problemApi from "@/api/problemApi";
import { useParams } from "react-router-dom";
import Loading from "@/common/helper/Loading";

// Small helpers and types
type Language = "javascript" | "python" | "cpp";

// type TestCase = {
//   id: number;
//   name: string;
//   inputs: { nums: string; target: string };
//   expected: string;
// };

// create template by LANGUAGE PROGRAM .
function generateFunctionTemplate(problem, lang = "js") {
  if (problem === null) return;
  const { functionName, parameters, returnType } = problem;

  // Tách danh sách tham số -> [{ type, name }]
  const paramList =
    parameters
      ?.split(",")
      .map((p) => {
        const parts = p.trim().split(" ");
        const type = parts.slice(0, -1).join(" ");
        const name = parts[parts.length - 1];
        return { type, name };
      })
      .filter((p) => p.name) || [];

  switch (lang.toLowerCase()) {
    // ---------------- 🟦 C++ ----------------
    case "cpp":
      return `${returnType} ${functionName}(${parameters}) {
    
}`;

    // ---------------- 🟨 JavaScript ----------------
    case "js":
    case "javascript": {
      const jsDocParams = paramList
        .map((p) => ` * @param {${convertTypeToJs(p.type)}} ${p.name}`)
        .join("\n");
      const jsDocReturn = ` * @return {${convertTypeToJs(returnType)}}`;
      const paramNames = paramList.map((p) => p.name).join(", ");

      return `/**
${jsDocParams}
${jsDocReturn}
 */
function ${functionName}(${paramNames}) {
    
}`;
    }

    // ---------------- 🟩 Python ----------------
    case "python": {
      const paramNames = paramList.map((p) => p.name).join(", ");
      return `def ${functionName}(${paramNames}):
    `;
    }

    default:
      return "// Unsupported language";
  }
}

function convertTypeToJs(type) {
  const map = {
    int: "number",
    long: "number",
    float: "number",
    double: "number",
    bool: "boolean",
    boolean: "boolean",
    char: "string",
    string: "string",
    "int[]": "number[]",
    "long[]": "number[]",
    "vector<int>": "number[]",
    "vector<string>": "string[]",
    "string[]": "string[]",
    "List[int]": "number[]",
    "List[str]": "string[]",
  };
  if (!type) return "any";
  return map[type.toLowerCase()] || "any";
}

// Types for test results
type TestResult = {
  id: number;
  name: string;
  status: "Accepted" | "Wrong Answer" | string;
  output: string;
  expected: string;
  inputs: { nums: string; target: string };
};

// Component riêng để hiển thị chi tiết kết quả
const ResultDetails: React.FC<{ result: TestResult | undefined | null }> = ({
  result,
}) => {
  if (!result) return null;

  const outputColor = result.status === "Accepted" ? "#00b8a3" : "#ef476f";

  return (
    <div className="result-details-container">
      <div className="result-section">
        <div className="result-label">Input</div>
        <div className="result-content">
          <div className="input-pair">
            <span className="param-name">nums</span>
            <code className="param-value">{result.inputs.nums}</code>
          </div>
          <div className="input-pair">
            <span className="param-name">target</span>
            <code className="param-value">{result.inputs.target}</code>
          </div>
        </div>
      </div>

      <div className="result-section">
        <div className="result-label">Output</div>
        <div className="result-content">
          <code className="output-value" style={{ color: outputColor }}>
            {result.output}
          </code>
        </div>
      </div>

      <div className="result-section">
        <div className="result-label">Expected</div>
        <div className="result-content">
          <code className="expected-value">{result.expected}</code>
        </div>
      </div>
    </div>
  );
};

const DetailPractice: React.FC = () => {
  const { slug } = useParams() || "";
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  const getProblem = async () => {
    const response = await problemApi.getProblemBySlug(slug);
    console.log(response);
    setProblem(response.data.data);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getProblem();
      setLoading(false);
    };

    fetchData();
  }, [slug]);

  const readNumber = (key: string, fallback: number) => {
    try {
      const v = localStorage.getItem(key);
      return v ? Number(v) : fallback;
    } catch {
      return fallback;
    }
  };

  // Resizable panels: left panel width as percent
  const [leftWidthPercent, setLeftWidthPercent] = useState<number>(() =>
    readNumber("cf_leftWidthPercent", 45)
  );
  // Vertical split within right panel: editor vs testcase (percent height for editor)
  const [editorHeightPercent, setEditorHeightPercent] = useState<number>(() =>
    readNumber("cf_editorHeightPercent", 65)
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const rightPanelRef = useRef<HTMLDivElement | null>(null);
  const isDraggingHorizontalRef = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left; // x inside container
      let percent = (x / rect.width) * 100;
      // clamp between 20% and 80%
      percent = Math.max(20, Math.min(80, percent));
      setLeftWidthPercent(percent);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      containerRef.current?.classList.remove("dragging");
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Touch support
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || !containerRef.current) return;
      const touch = e.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      let percent = (x / rect.width) * 100;
      percent = Math.max(20, Math.min(80, percent));
      setLeftWidthPercent(percent);
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      containerRef.current?.classList.remove("dragging");
    };

    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  // Horizontal (vertical resize) handlers for right panel: editor / testcase
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingHorizontalRef.current || !rightPanelRef.current) return;
      const rect = rightPanelRef.current.getBoundingClientRect();
      const y = e.clientY - rect.top; // y inside right panel
      let percent = (y / rect.height) * 100;
      // clamp so editor is between 20% and 90%
      percent = Math.max(20, Math.min(90, percent));
      setEditorHeightPercent(percent);
    };

    const handleMouseUp = () => {
      if (!isDraggingHorizontalRef.current) return;
      isDraggingHorizontalRef.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      rightPanelRef.current?.classList.remove("dragging-horizontal");
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingHorizontalRef.current || !rightPanelRef.current) return;
      const touch = e.touches[0];
      const rect = rightPanelRef.current.getBoundingClientRect();
      const y = touch.clientY - rect.top;
      let percent = (y / rect.height) * 100;
      percent = Math.max(20, Math.min(90, percent));
      setEditorHeightPercent(percent);
    };

    const handleTouchEnd = () => {
      isDraggingHorizontalRef.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      rightPanelRef.current?.classList.remove("dragging-horizontal");
    };

    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  const [activeTab, setActiveTab] = useState("description");
  // const [language, setLanguage] = useState<Language>(
  //   () => (localStorage.getItem("cf_language") as Language) || "javascript"
  // );

  const [language, setLanguage] = useState("cpp");

  // Monaco themes: 'vs' is the default light theme, 'vs-dark' is dark
  const [theme, setTheme] = useState<"vs" | "vs-dark">(
    () => (localStorage.getItem("cf_theme") as "vs" | "vs-dark") || "vs-dark"
  );
  const [testcaseTab, setTestcaseTab] = useState("testcase");

  const [testCases, setTestCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState([]);
  const currentCase = testCases.find((c) => c.id === selectedCaseId);

  const initialCode = generateFunctionTemplate(problem, "cpp");

  const [code, setCode] = useState<string>(() => {
    try {
      return localStorage.getItem("cf_code") || initialCode;
    } catch {
      return initialCode;
    }
  });
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);

  const handleEditorChange = useCallback((value?: string | null) => {
    const v = value ?? "";
    setCode(v);
    try {
      localStorage.setItem("cf_code", v);
    } catch {
      // ignore
    }
  }, []);

  const handleRun = () => {
    const submissionPayload = {
      problemId: problem.problemId,
      language: language,
      code: code,
      testCases: testCases.map((t) => t.testCaseId),
    };

    console.log("--- SUBMISSION PAYLOAD ---");
    console.log(submissionPayload);
    console.log("--------------------------");

    setIsTesting(true);
    setTestcaseTab("result");

    setTimeout(() => {
      const results = testCases.map((caseItem) => {
        // Giả lập kết quả
        const passed = caseItem.id === 0 || caseItem.id === 2;

        const simulatedOutput = passed
          ? caseItem.expected
          : `[${Math.floor(Math.random() * 3)}, ${Math.floor(
              Math.random() * 3
            )}]`;

        return {
          id: caseItem.id,
          name: caseItem.name,
          status: passed ? "Accepted" : "Wrong Answer",
          output: simulatedOutput,
          expected: caseItem.expected,
          inputs: caseItem.inputs,
        };
      });

      setTestResults(results);
      setIsTesting(false);
    }, 1500);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as "javascript" | "python" | "cpp";
    setLanguage(newLang);
    setCode(generateFunctionTemplate(problem, newLang));
    setTestResults(null);
  };

  // Persist certain UI preferences when they change
  useEffect(() => {
    try {
      localStorage.setItem("cf_leftWidthPercent", String(leftWidthPercent));
    } catch (err) {
      void err;
    }
  }, [leftWidthPercent]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "cf_editorHeightPercent",
        String(editorHeightPercent)
      );
    } catch (err) {
      void err;
    }
  }, [editorHeightPercent]);

  useEffect(() => {
    try {
      localStorage.setItem("cf_language", language);
    } catch (err) {
      void err;
    }
  }, [language]);

  useEffect(() => {
    try {
      localStorage.setItem("cf_theme", theme);
    } catch (err) {
      void err;
    }
  }, [theme]);

  // Drag handlers for divider
  const handleDividerMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    containerRef.current?.classList.add("dragging");
    e.preventDefault();
  };

  const handleDividerTouchStart = (e: React.TouchEvent) => {
    isDraggingRef.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    containerRef.current?.classList.add("dragging");
    // prevent default to avoid scrolling
    e.preventDefault();
  };

  // Keyboard accessibility for vertical divider (left/right)
  const handleDividerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setLeftWidthPercent((p) => Math.max(20, Math.min(80, p - 2)));
    } else if (e.key === "ArrowRight") {
      setLeftWidthPercent((p) => Math.max(20, Math.min(80, p + 2)));
    } else if (e.key === "Home") {
      setLeftWidthPercent(20);
    } else if (e.key === "End") {
      setLeftWidthPercent(80);
    }
  };

  // Add a simple handler to add a new test case (prevents unused setTestCases warning)
  const handleAddCase = () => {
    const newId = testCases.length
      ? Math.max(...testCases.map((c) => c.id)) + 1
      : 0;
    const newCase = {
      id: newId,
      name: `Case ${newId + 1}`,
      inputs: { nums: "[]", target: "0" },
      expected: "[]",
    };
    setTestCases((prev) => [...prev, newCase]);
    setSelectedCaseId(newId);
  };

  // Handlers for horizontal divider between editor and testcase
  const handleHDividerMouseDown = (e: React.MouseEvent) => {
    isDraggingHorizontalRef.current = true;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
    rightPanelRef.current?.classList.add("dragging-horizontal");
    e.preventDefault();
  };

  const handleHDividerTouchStart = (e: React.TouchEvent) => {
    isDraggingHorizontalRef.current = true;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
    rightPanelRef.current?.classList.add("dragging-horizontal");
    e.preventDefault();
  };

  // Keyboard accessibility for horizontal divider (up/down)
  const handleHDividerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      setEditorHeightPercent((p) => Math.max(20, Math.min(90, p - 2)));
    } else if (e.key === "ArrowDown") {
      setEditorHeightPercent((p) => Math.max(20, Math.min(90, p + 2)));
    } else if (e.key === "Home") {
      setEditorHeightPercent(90);
    } else if (e.key === "End") {
      setEditorHeightPercent(20);
    }
  };

  const passedCount = testResults
    ? testResults.filter((r) => r.status === "Accepted").length
    : 0;
  const totalCount = testResults ? testResults.length : 0;

  return (
    <>
      {loading && <Loading></Loading>}
      {problem && (
        <div
          className="detail-practice-container"
          ref={containerRef}
          style={{ userSelect: isDraggingRef.current ? "none" : undefined }}
        >
          {/* LEFT PANEL: Problem Description */}
          <div
            className="left-panel"
            style={{ width: `${leftWidthPercent}%`, minWidth: "20%" }}
          >
            <div className="panel-header">
              <div
                className={`tab ${activeTab === "description" ? "active" : ""}`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </div>
              <div
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
              </div>
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
                    <div className="example">
                      <div className="example-title">Example 1:</div>
                      <pre>
                        Input: nums = [2,7,11,15], target = 9{"\n"}
                        Output: [0,1]{"\n"}
                        Explanation: Because nums[0] + nums[1] == 9, we return
                        [0, 1].
                      </pre>
                    </div>
                    <div className="constraints">
                      <div className="constraints-title">Constraints:</div>
                      <ul>
                        <li>2 ≤ nums.length ≤ 10⁴</li>
                        <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
                        <li>-10⁹ ≤ target ≤ 10⁹</li>
                        <li>Only one valid answer exists.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: Editor and Test Case Panel */}
          {/* Divider */}
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

          <div
            className="right-panel"
            style={{ width: `${100 - leftWidthPercent}%`, minWidth: "20%" }}
            ref={rightPanelRef}
          >
            <div className="editor-header">
              <div className="editor-controls">
                {/* SỬA LỖI: Hoàn thiện thẻ <select> */}
                <select
                  className="language-select"
                  value={language}
                  onChange={handleLanguageChange} // ✅ Dùng handler đổi ngôn ngữ
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
                  disabled={isTesting}
                >
                  {isTesting ? (
                    <div className="loading-animation"></div>
                  ) : (
                    <>▶ Run</>
                  )}
                </button>
                <button className="btn btn-submit" disabled={isTesting}>
                  Submit
                </button>
              </div>
            </div>

            {/* THÊM: Editor Wrapper với component Editor hoàn chỉnh */}
            <div
              className="editor-wrapper"
              style={{ height: `calc(${editorHeightPercent}% - 1px)` }}
            >
              <Editor
                height="100%"
                language={language}
                theme={theme}
                value={code}
                onChange={handleEditorChange} // ✅ THÊM: Callback khi code thay đổi
                options={{
                  // ✅ THÊM: Các options cho Monaco Editor
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

            {/* Horizontal divider between editor and testcase */}
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
                          // background: passedCount === totalCount ? '#22c55e' : '#ef4444',
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

              {/* TESTCASE INPUTS TAB */}
              {testcaseTab === "testcase" && (
                <div className="testcase-content">
                  <div className="case-selector">
                    {testCases.map((caseItem) => (
                      <div
                        key={caseItem.id}
                        className={`case-item ${
                          selectedCaseId === caseItem.id ? "active" : ""
                        }`}
                        onClick={() => setSelectedCaseId(caseItem.id)}
                      >
                        {caseItem.name}
                      </div>
                    ))}
                    <div className="case-item add-case" onClick={handleAddCase}>
                      +
                    </div>
                  </div>

                  <div className="testcase-inputs">
                    {currentCase && (
                      <>
                        <div className="input-group">
                          <label className="input-label">nums =</label>
                          <div className="input-value">
                            {currentCase.inputs.nums}
                          </div>
                        </div>
                        <div className="input-group">
                          <label className="input-label">target =</label>
                          <div className="input-value">
                            {currentCase.inputs.target}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* TEST RESULT TAB */}
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
                      {/* Hiển thị selector cho tất cả test cases */}
                      <div className="case-selector">
                        {testResults.map((result) => (
                          <div
                            key={result.id}
                            className={`case-item ${
                              selectedCaseId === result.id ? "active" : ""
                            } ${
                              result.status === "Accepted"
                                ? "case-passed"
                                : "case-failed"
                            }`}
                            onClick={() => setSelectedCaseId(result.id)}
                          >
                            {result.name}{" "}
                            {result.status === "Accepted" ? "✓" : "✗"}
                          </div>
                        ))}
                      </div>

                      {/* Summary cho case được chọn */}
                      {testResults.length > 0 && (
                        <div
                          className={`test-case-summary ${
                            testResults.find((r) => r.id === selectedCaseId)
                              ?.status === "Accepted"
                              ? "accepted"
                              : "wrong-answer"
                          }`}
                        >
                          <span>
                            {
                              testResults.find((r) => r.id === selectedCaseId)
                                ?.status
                            }
                          </span>
                          <div className="summary-stats">
                            <span>Runtime: 50 ms</span>
                            <span>Memory: 45.2 MB</span>
                          </div>
                        </div>
                      )}

                      {/* Chi tiết kết quả của Case đang được chọn */}
                      <ResultDetails
                        result={testResults.find(
                          (r) => r.id === selectedCaseId
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
      )}
    </>
  );
};

export default DetailPractice;
