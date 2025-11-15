import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  BookOpen,
  PlayCircle,
} from "lucide-react";
import type { LessonDto } from "@/features/course/types";
import { useUpdateProgress } from "@/features/progress/hooks/useUpdateProgress";
import { openNotification } from "@/common/helper/notification";
import { Result } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

interface Props {
  lesson: LessonDto;
}

const QuizContent: React.FC<Props> = ({ lesson }) => {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const { updateProgress, isCompleted } = useUpdateProgress();
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, number>
  >({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanations, setShowExplanations] = useState<
    Record<string, boolean>
  >({});
  const [showReview, setShowReview] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const content = lesson?.quizContent;

  useEffect(() => {
    setSelectedAnswers({});
    setSubmitted(false);
    setSubmitting(false);
    setScore(0);
    setShowExplanations({});
    setShowReview(false);
    setIsStarted(false);
  }, [lesson?.lessonId]);

  if (!content || !content.questions) {
    return (
      <Result
        status="404"
        title="404"
        subTitle="Xin lỗi! Nội dung không tìm thấy"
      />
    );
  }
  if (!isStarted) {
    return (
      <div className="quiz-intro">
        <div className="quiz-intro__content">
          <div className="quiz-header">
            <div className="quiz-header__icon"></div>
            <h1 className="quiz-header__title">
              <BookOpen size={28} /> {content.title}
            </h1>
            <p className="quiz-header__description">{content.description}</p>
            <div className="quiz-header__meta">
              <span className="quiz-meta-item">
                <span className="quiz-meta-icon">📝</span>
                {content.questions.length} câu hỏi
              </span>
              <span className="quiz-meta-item">
                <span className="quiz-meta-icon">⏱️</span>
                Không giới hạn thời gian
              </span>
            </div>
          </div>

          {lesson.isCompleted && (
            <div className="quiz-intro__completed">
              <CheckCircle size={20} />
              <span>Bạn đã hoàn thành bài kiểm tra này</span>
            </div>
          )}

          <button
            className="quiz-btn quiz-btn--primary quiz-intro__button"
            onClick={() => setIsStarted(true)}
          >
            <PlayCircle size={20} />
            {lesson.isCompleted ? "Làm lại bài kiểm tra" : "Bắt đầu làm bài"}
          </button>
        </div>
      </div>
    );
  }
  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const calculateScore = () => {
    let correct = 0;
    content.questions.forEach((q) => {
      if (selectedAnswers[q.questionId] === q.correctIndex) {
        correct++;
      }
    });
    return Math.round((correct / content.questions.length) * 100);
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedAnswers).length !== content.questions.length) {
      openNotification(
        "warning",
        "Cảnh báo",
        "Vui lòng hoàn thành hết câu hỏi"
      );
      return;
    }

    setSubmitting(true);

    try {
      const finalScore = calculateScore();
      setScore(finalScore);

      if (finalScore >= 70 && !isCompleted) {
        await updateProgress(lesson.lessonId, "completed");
        // 🔥 Đánh dấu cache 'lessons' là cũ → React Query sẽ tự refetch
        queryClient.invalidateQueries(["course", slug]);
        queryClient.invalidateQueries(["lessons", lesson.lessonId]);
      }

      setSubmitted(true);

      // Auto show explanations for wrong answers
      const wrongAnswers: Record<string, boolean> = {};
      content.questions.forEach((q) => {
        if (selectedAnswers[q.questionId] !== q.correctIndex) {
          wrongAnswers[q.questionId] = true;
        }
      });
      setShowExplanations(wrongAnswers);
    } catch (error) {
      openNotification("error", "Lỗi", "Có lỗi xảy ra khi nộp bài!");
    } finally {
      setSubmitting(false);
    }
  };

  function handleRetry() {
    setSubmitted(false);
    setSelectedAnswers({});
    setScore(0);
    setShowExplanations({});
    setShowReview(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const toggleExplanation = (questionId: string) => {
    setShowExplanations((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const correctCount = content.questions.filter(
    (q) => selectedAnswers[q.questionId] === q.correctIndex
  ).length;
  const passed = score >= 70;

  return (
    <div className="quiz-container">
      {/* Score Card */}
      {submitted && (
        <div
          className={`quiz-result ${
            passed ? "quiz-result--passed" : "quiz-result--failed"
          }`}
        >
          <div className="quiz-result__icon">
            <Trophy size={48} />
          </div>
          <h2 className="quiz-result__score">{score}%</h2>
          <p className="quiz-result__message">
            {passed
              ? "🎉 Chúc mừng! Bạn đã vượt qua bài kiểm tra"
              : "😔 Chưa đạt yêu cầu"}
          </p>
          <div className="quiz-result__stats">
            <span className="quiz-stat-item quiz-stat-item--correct">
              ✅ Đúng: {correctCount}/{content.questions.length}
            </span>
            <span className="quiz-stat-item quiz-stat-item--wrong">
              ❌ Sai: {content.questions.length - correctCount}
            </span>
          </div>

          <div className="quiz-result__actions">
            <button
              className="quiz-btn quiz-btn--secondary"
              onClick={() => setShowReview(!showReview)}
            >
              <BookOpen size={18} />
              {showReview ? "Ẩn đáp án" : "Xem lại đáp án"}
            </button>

            {!passed && (
              <button
                className="quiz-btn quiz-btn--primary"
                onClick={handleRetry}
              >
                <RotateCcw size={18} />
                Làm lại
              </button>
            )}
          </div>
        </div>
      )}

      {/* Questions */}
      <div className="quiz-questions">
        {content.questions.map((q, idx) => {
          const selected = selectedAnswers[q.questionId];
          const isCorrect = submitted && selected === q.correctIndex;
          const isWrong =
            submitted && selected !== undefined && selected !== q.correctIndex;

          return (
            <div
              key={q.questionId}
              className={`quiz-question ${
                submitted
                  ? isCorrect
                    ? "quiz-question--correct"
                    : isWrong
                    ? "quiz-question--wrong"
                    : ""
                  : ""
              }`}
            >
              {/* Question Header */}
              <div className="quiz-question__header">
                <h3 className="quiz-question__title">
                  <span
                    className={`quiz-question__number ${
                      submitted
                        ? isCorrect
                          ? "quiz-question__number--correct"
                          : isWrong
                          ? "quiz-question__number--wrong"
                          : ""
                        : ""
                    }`}
                  >
                    {idx + 1}
                  </span>
                  {q.question}
                </h3>

                {submitted && (
                  <div className="quiz-question__status">
                    {isCorrect ? (
                      <CheckCircle size={24} className="icon-correct" />
                    ) : isWrong ? (
                      <XCircle size={24} className="icon-wrong" />
                    ) : null}
                  </div>
                )}
              </div>

              {/* Answer Options */}
              <div className="quiz-answers">
                {q.answers.map((answer, answerIdx) => {
                  const isSelected = selected === answerIdx;
                  const isCorrectAnswer = answerIdx === q.correctIndex;
                  const showAsCorrect = submitted && isCorrectAnswer;
                  const showAsWrong =
                    submitted && isSelected && !isCorrectAnswer;

                  return (
                    <label
                      key={answerIdx}
                      className={`quiz-answer ${
                        showAsCorrect
                          ? "quiz-answer--correct"
                          : showAsWrong
                          ? "quiz-answer--wrong"
                          : isSelected
                          ? "quiz-answer--selected"
                          : ""
                      } ${
                        submitted && !isSelected && !isCorrectAnswer
                          ? "quiz-answer--dimmed"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${q.questionId}`}
                        checked={isSelected}
                        onChange={() =>
                          handleAnswerSelect(q.questionId, answerIdx)
                        }
                        disabled={submitted}
                        className="quiz-answer__radio"
                      />
                      <span className="quiz-answer__text">{answer}</span>
                      {submitted && isCorrectAnswer && (
                        <CheckCircle
                          size={20}
                          className="quiz-answer__icon icon-correct"
                        />
                      )}
                      {submitted && showAsWrong && (
                        <XCircle
                          size={20}
                          className="quiz-answer__icon icon-wrong"
                        />
                      )}
                    </label>
                  );
                })}
              </div>

              {/* Explanation */}
              {submitted &&
                (showReview || showExplanations[q.questionId]) &&
                q.explanation && (
                  <div className="quiz-explanation">
                    <div className="quiz-explanation__content">
                      <AlertCircle
                        size={20}
                        className="quiz-explanation__icon"
                      />
                      <div className="quiz-explanation__text">
                        <p className="quiz-explanation__label">Giải thích:</p>
                        <p className="quiz-explanation__detail">
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              {submitted &&
                !showReview &&
                !showExplanations[q.questionId] &&
                q.explanation && (
                  <button
                    className="quiz-btn-explanation"
                    onClick={() => toggleExplanation(q.questionId)}
                  >
                    <ArrowRight size={16} />
                    Xem giải thích
                  </button>
                )}
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {!submitted && (
        <div className="quiz-submit">
          <button
            onClick={handleSubmit}
            disabled={
              submitting ||
              Object.keys(selectedAnswers).length !== content.questions.length
            }
            className={`quiz-btn quiz-btn--submit ${
              Object.keys(selectedAnswers).length === content.questions.length
                ? "quiz-btn--submit-active"
                : "quiz-btn--submit-disabled"
            }`}
          >
            {submitting ? "⏳ Đang xử lý..." : "Nộp bài"}
          </button>
          <p className="quiz-submit__progress">
            {Object.keys(selectedAnswers).length}/{content.questions.length} câu
            đã trả lời
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizContent;
