import type { LessonDto } from "@/features/course/types";
import { Play } from "lucide-react";
import { useState } from "react";

const CodeContent = ({ lesson }: { lesson: LessonDto }) => {
  const content = lesson?.codingProblem;

  if (!content) {
    return (
      <div className="lesson-content__empty">No coding problem available</div>
    );
  }

  const [code, setCode] = useState(content.starterCode || "");
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="lesson-content__code">
      <div className="lesson-content__code-header">
        <h3>{lesson.title}</h3>
        <p>{content.problemStatement}</p>
      </div>

      <div className="lesson-content__code-editor">
        <div className="lesson-content__code-toolbar">
          <button
            className="lesson-content__btn lesson-content__btn--secondary"
            onClick={() => setCode(content.starterCode || "")}
          >
            Reset
          </button>
          <button
            className="lesson-content__btn lesson-content__btn--primary"
            onClick={() => alert("Running code...")}
          >
            <Play size={16} /> Run Code
          </button>
          {content.solutionCode && (
            <button
              className="lesson-content__btn lesson-content__btn--info"
              onClick={() => setShowSolution(!showSolution)}
            >
              {showSolution ? "Hide" : "Show"} Solution
            </button>
          )}
        </div>

        <textarea
          className="lesson-content__code-textarea"
          value={showSolution ? content.solutionCode : code}
          onChange={(e) => !showSolution && setCode(e.target.value)}
          spellCheck={false}
        />
      </div>

      <div className="lesson-content__code-output">
        <div className="lesson-content__code-output-header">Output:</div>
        <div className="lesson-content__code-output-content">
          Click "Run Code" to see the output
        </div>
      </div>
    </div>
  );
};
export default CodeContent;
