import { ArrowLeft } from "lucide-react";

const LessonHeader = () => {
  return (
    <>
      <header className="lesson-page__header">
        <div className="lesson-page__header-left">
          <button className="lesson-page__back-btn">
            <ArrowLeft />
          </button>
          <p>Phần cứng máy tính</p>
        </div>
        <div className="lesson-page__page-numbers">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              className={`lesson-page__page-number ${
                num === 1 ? "lesson-page__page-number--active" : ""
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </header>
    </>
  );
};
export default LessonHeader;
