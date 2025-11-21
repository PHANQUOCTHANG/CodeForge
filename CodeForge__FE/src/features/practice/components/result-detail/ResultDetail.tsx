import type { TestResult, TestCase } from "../../types";

interface ResultDetailsProps {
  result?: TestResult;
  testCase?: TestCase;
}

const ResultDetails = ({ result, testCase }: ResultDetailsProps) => {
  if (!result) return null;

  const outputColor = result.status === "Accepted" ? "#00b8a3" : "#ef476f";

  // hiển thị input.
  const renderInputs = () => {
    if (!testCase) return <div className="input-value">(no input)</div>;
    const { input } = testCase;
    if (input == null) return <div className="input-value">(no input)</div>;

    if (typeof input === "object" && !Array.isArray(input)) {
      return Object.entries(input).map(([key, value]) => (
        <div className="input-pair" key={key}>
          <span className="param-name">{key}</span>
          <code className="param-value">
            {typeof value === "string" ? value : JSON.stringify(value)}
          </code>
        </div>
      ));
    }

    return (
      <div className="input-pair">
        <span className="param-name">input</span>
        <code className="param-value">{String(input)}</code>
      </div>
    );
  };

  return (
    <div className="result-details-container">
      <div className="result-section">
        <div className="result-label">Input</div>
        <div className="result-content">{renderInputs()}</div>
      </div>

      <div className="result-section">
        <div className="result-label">Output</div>
        <div className="result-content">
          <code className="output-value" style={{ color: outputColor }}>
            {result.actualOutput}
          </code>
        </div>
      </div>

      <div className="result-section">
        <div className="result-label">Expected</div>
        <div className="result-content">
          <code className="expected-value">{testCase?.expectedOutput}</code>
        </div>
      </div>
    </div>
  );
};

export default ResultDetails;
