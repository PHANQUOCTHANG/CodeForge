import React, { useState } from "react";
import { Play, Menu, X } from "lucide-react";
import "./LessonCoding.scss";

const LessonCoding = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [code, setCode] = useState(
    "--Show all the information of the syllabus of course\nSELECT * FROM syllabus;"
  );
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const tabs = [
    { id: 1, label: "1" },
    { id: 2, label: "2" },
    { id: 3, label: "3" },
    { id: 4, label: "4" },
    { id: 5, label: "5" },
    { id: 6, label: "6" },
    { id: 7, label: "7" },
    { id: 8, label: "8" },
    { id: 9, label: "9" },
    { id: 10, label: "10" },
  ];

  const mockData = {
    syllabus: [
      { id: 1, name: "Querying Data" },
      { id: 2, name: "Filtering Data" },
      { id: 3, name: "Joining Tables" },
      { id: 4, name: "Aggregations" },
    ],
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      setOutput(mockData);
      setIsRunning(false);
    }, 500);
  };

  const handleSubmit = () => {
    alert("Bài làm đã được nộp!");
  };

  return (
    <div className="lesson-coding">
      {/* Header */}
      <header className="lesson-coding__header">
        <div className="lesson-coding__header-left">
          <button
            className="lesson-coding__menu-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="lesson-coding__title">
            [SQL] What is in the database?
          </span>
        </div>
        <div className="lesson-coding__tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`lesson-coding__tab ${
                activeTab === tab.id ? "lesson-coding__tab--active" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="lesson-coding__content">
        {/* Sidebar */}
        <aside
          className={`lesson-coding__sidebar ${
            isSidebarOpen ? "lesson-coding__sidebar--open" : ""
          }`}
        >
          <div className="lesson-coding__user">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=duyentm7"
              alt="User Avatar"
              className="lesson-coding__avatar"
            />
            <div className="lesson-coding__user-info">
              <span className="lesson-coding__username">duyentm7</span>
              <span className="lesson-coding__badge">Easy</span>
              <span className="lesson-coding__points">🔵 100 Points</span>
            </div>
          </div>

          <section className="lesson-coding__section">
            <h2 className="lesson-coding__section-title">Task</h2>
            <ul className="lesson-coding__task-list">
              <li>
                Read the information below to get the most overview about{" "}
                <strong>SQL</strong>
              </li>
              <li>
                Press <code>"Run code"</code> button to check the test cases.
              </li>
              <li>
                After that, press <code>"Submit"</code> button to submit and
                finish the task.
              </li>
            </ul>
          </section>

          <section className="lesson-coding__section">
            <h2 className="lesson-coding__section-title">Theory</h2>

            <h3 className="lesson-coding__subtitle">What is a database?</h3>
            <p className="lesson-coding__text">
              Database is a organized collection of data. For example a database
              of a college would be having a collection of data such as:
              Personal records of Students, Students performance history,
              Teachers data, Financial department data etc.
            </p>

            <h3 className="lesson-coding__subtitle">Relational Databases</h3>
            <p className="lesson-coding__text">
              In relational database, data is organized in form of tables. A
              table contains rows and columns of data. Table has a unique key to
              identify each row of the table.
            </p>
            <p className="lesson-coding__text">
              SQL is used to interact with relational databases. We often refer
              relational database as SQL database.
            </p>

            <h3 className="lesson-coding__subtitle">What is SQL?</h3>
            <p className="lesson-coding__text">
              SQL stands for Structured Query Language, which is a standardised
              language for interacting with RDBMS (Relational Database
              Management System). Some of the popular relational database
              example are: MySQL, Oracle, mariaDB, postgreSQL etc.
            </p>
            <p className="lesson-coding__text">
              SQL is used to perform C.R.U.D (Create, Retrieve, Update & Delete)
              operations on relational databases.
            </p>
            <p className="lesson-coding__text lesson-coding__text--highlight">
              In this course, we will use PostgreSQL to solve all the task.
            </p>
          </section>
        </aside>

        {/* Main Content */}
        <main className="lesson-coding__main">
          <div className="lesson-coding__editor">
            <div className="lesson-coding__editor-header">
              <span className="lesson-coding__editor-lang">PostgreSQL</span>
              <span className="lesson-coding__editor-theme">Dark</span>
            </div>
            <div className="lesson-coding__editor-content">
              <div className="lesson-coding__line-numbers">
                <span>1</span>
                <span>2</span>
              </div>
              <textarea
                className="lesson-coding__textarea"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
              />
            </div>
          </div>

          <div className="lesson-coding__actions">
            <button
              className="lesson-coding__btn lesson-coding__btn--run"
              onClick={handleRunCode}
              disabled={isRunning}
            >
              <Play size={16} />
              {isRunning ? "Running..." : "Run Code"}
            </button>
            <button
              className="lesson-coding__btn lesson-coding__btn--submit"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>

          <div className="lesson-coding__output">
            <h3 className="lesson-coding__output-title">TEST CASE</h3>
            {!output ? (
              <p className="lesson-coding__output-placeholder">
                Please run your code first!
              </p>
            ) : (
              <div className="lesson-coding__testcase">
                <div className="lesson-coding__testcase-header">Testcase 1</div>
                <div className="lesson-coding__testcase-section">
                  <strong>Input</strong>
                  <div className="lesson-coding__table-wrapper">
                    <table className="lesson-coding__table">
                      <thead>
                        <tr>
                          <th colSpan={2}>syllabus</th>
                        </tr>
                        <tr>
                          <th>id</th>
                          <th>name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {output.syllabus.map((row) => (
                          <tr key={row.id}>
                            <td>{row.id}</td>
                            <td>{row.name}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LessonCoding;
