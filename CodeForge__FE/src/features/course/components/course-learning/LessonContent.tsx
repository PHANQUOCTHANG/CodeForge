import React, { useEffect, useRef, useState } from "react";
import { Collapse } from "antd";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import type { CourseDetail } from "@/features/course/types";
import {
  CheckCircle,
  Code,
  FileText,
  Video,
  Award,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";
import TextContent from "@/features/course/components/course-learning/TextContent";
import VideoContent from "@/features/course/components/course-learning/VideoContent";
import CodeContent from "@/features/course/components/course-learning/CodeContent";
import QuizContent from "@/features/course/components/course-learning/QuizContent";
import type { LessonDto } from "@/features/Lesson/types";

const { Panel } = Collapse;

interface Props {
  course: CourseDetail | undefined;
  moduleId: string | undefined;
  lessonId: string | undefined;
  lesson: LessonDto | undefined;
}

// Main LessonType component
const LessonType = ({ lesson }: { lesson: LessonDto | undefined }) => {
  const content = lesson?.lessonType;

  if (!content || !lesson) {
    return (
      <div className="lesson-content__empty">
        <p>Chọn một bài học để bắt đầu</p>
      </div>
    );
  }
  console.log(lesson);
  return (
    <div className="lesson-content">
      {content === "text" && <TextContent lesson={lesson} />}
      {content === "video" && <VideoContent lesson={lesson} />}
      {content === "coding" && <CodeContent lesson={lesson} />}
      {content === "quiz" && <QuizContent lesson={lesson} />}
    </div>
  );
};
// Main LessonContent component
const LessonContent: React.FC<Props> = ({
  course,
  moduleId,
  lessonId,
  lesson,
}) => {
  const [leftWidth, setLeftWidth] = useState<number>(50); // percentage
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showLeftPanel, setShowLeftPanel] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const initialX = useRef<number>(0);
  const initialWidth = useRef<number>(30);
  const rafRef = useRef<number | null>(null);

  // responsive detection
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setShowLeftPanel(!mobile);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // calculate and set leftWidth based on clientX safely
  const updateWidthFromClientX = (clientX: number) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    // left area allowed: from rect.left to rect.right
    const relativeX = Math.max(rect.left, Math.min(clientX, rect.right));
    const newWidthPct = ((relativeX - rect.left) / rect.width) * 100;

    // bounds (percentage)
    const MIN = 18; // min left width %
    const MAX = 100; // max left width %
    let clamped = Math.max(MIN, Math.min(MAX, newWidthPct));

    // optional snap points
    const snapPoints = [20, 25, 33, 40, 50];
    const snapThreshold = 2; // percent
    for (const p of snapPoints) {
      if (Math.abs(clamped - p) < snapThreshold) {
        clamped = p;
        break;
      }
    }

    // apply via RAF to keep smooth
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => setLeftWidth(clamped));
  };

  // start dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return;
    e.preventDefault();
    initialX.current = e.clientX;
    initialWidth.current = leftWidth;
    setIsResizing(true);

    // prevent text selection
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
  };

  // global mouse handlers while dragging
  useEffect(() => {
    if (!isResizing) return;

    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      updateWidthFromClientX(e.clientX);
    };
    const onMouseUp = () => {
      setIsResizing(false);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    // attach to document so iframe won't stop events (overlay helps but keep for robustness)
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseUp);

    // touch support (desktop/tablet with touch)
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches?.[0]) updateWidthFromClientX(e.touches[0].clientX);
    };
    const onTouchEnd = () => onMouseUp();
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseUp);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isResizing, isMobile]);

  // Mobile swipe to open/close panel
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || touchStartX.current == null) return;
    const diff = e.touches[0].clientX - touchStartX.current;
    // swipe right to open, left to close
    const THRESHOLD = 40;
    if (diff > THRESHOLD) {
      setShowLeftPanel(true);
      touchStartX.current = null;
    } else if (diff < -THRESHOLD) {
      setShowLeftPanel(false);
      touchStartX.current = null;
    }
  };

  // helpers
  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video size={18} />;
      case "text":
        return <FileText size={18} />;
      case "coding":
        return <Code size={18} />;
      case "quiz":
        return <Award size={18} />;
      default:
        return <BookOpen size={18} />;
    }
  };

  if (!course) {
    return <div className="lesson-page--loading">Đang tải...</div>;
  }

  return (
    <div className="lesson-page__content" ref={containerRef}>
      {/* left panel */}
      <div
        className={`lesson-page__left-panel ${
          !showLeftPanel ? "lesson-page__left-panel--hidden" : ""
        }`}
        style={!isMobile ? { width: `${leftWidth}%` } : undefined}
      >
        <div className="lesson-page__module-list">
          <h2>Danh sách bài học</h2>
          <Collapse
            accordion
            bordered={false}
            expandIconPosition="end"
            defaultActiveKey={moduleId ? [moduleId] : []}
            expandIcon={({ isActive }) =>
              isActive ? <ChevronUp size={18} /> : <ChevronDown size={18} />
            }
            className="modules-list"
          >
            {course.modules.map((module) => {
              // Calculate completed lessons
              const completedLessons = module.lessons.filter(
                (lesson) => lesson.isCompleted
              ).length;

              // Calculate total duration for the module
              const totalDuration = module.lessons.reduce(
                (sum, lesson) => sum + (lesson.duration || 0),
                0
              );

              // Format duration to minutes
              const formatDuration = (duration: number) => {
                const minutes = Math.floor(duration / 60);
                return `${minutes} phút`;
              };

              return (
                <Panel
                  key={module.moduleId}
                  header={
                    <div className="module-header">
                      <div>
                        <h3 className="module-title">{module.title}</h3>
                        <span className="lesson-count">
                          {completedLessons}/{module.lessons.length} bài học •{" "}
                          {formatDuration(totalDuration)}
                        </span>
                      </div>
                    </div>
                  }
                >
                  <div className="lessons-list">
                    {module.lessons.map((lessonItem) => {
                      const isActive = lessonItem.lessonId === lessonId;
                      const lessonPath = `/courses/${course.slug}/learn/${module.moduleId}/${lessonItem.lessonId}`;
                      const isCompleted = lessonItem.isCompleted;
                      return (
                        <div
                          key={lessonItem.lessonId}
                          className={`lesson-item ${isActive ? "active" : ""} ${
                            isCompleted ? "completed" : ""
                          }`}
                        >
                          <Link to={lessonPath} className="lesson-link">
                            <div className="lesson-icon">
                              {getLessonIcon(lessonItem.lessonType)}
                            </div>
                            <span className="lesson-title">
                              {lessonItem.title}
                            </span>
                            {isCompleted && (
                              <CheckCircle size={16} color="#22c55e" />
                            )}
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </Panel>
              );
            })}
          </Collapse>
        </div>
      </div>

      {/* resizer (only on non-mobile and when panel visible) */}
      {!isMobile && showLeftPanel && (
        <div
          className={`lesson-page__resizer ${
            isResizing ? "lesson-page__resizer--active" : ""
          }`}
          onMouseDown={handleMouseDown}
          role="separator"
          aria-orientation="vertical"
        >
          <div className="lesson-page__resizer-handle" />
        </div>
      )}
      {lesson && lesson.lessonType === "coding" && (
        <CodeContent lesson={lesson} />
      )}
      {/* right panel */}
      <div
        className="lesson-page__right-panel"
        style={
          !isMobile && showLeftPanel
            ? { width: `calc(${100 - leftWidth}% - 8px)` } // account resizer width
            : undefined
        }
      >
        {lesson && lesson.lessonType !== "coding" && (
          <LessonType lesson={lesson} />
        )}
      </div>

      {/* overlay to capture pointer during dragging - prevents iframe from stealing events */}
      {isResizing && (
        <div
          className="lesson-page__drag-overlay"
          onMouseMove={(e) => updateWidthFromClientX(e.clientX)}
          onMouseUp={() => {
            setIsResizing(false);
            document.body.style.userSelect = "";
            document.body.style.cursor = "";
          }}
          onTouchMove={(e) => {
            if (e.touches?.[0]) updateWidthFromClientX(e.touches[0].clientX);
          }}
          onTouchEnd={() => {
            setIsResizing(false);
            document.body.style.userSelect = "";
            document.body.style.cursor = "";
          }}
          aria-hidden
        />
      )}

      {/* mobile panel toggle */}
      {isMobile && (
        <>
          <button
            className="lesson-page__panel-toggle"
            onClick={() => setShowLeftPanel((s) => !s)}
            aria-label={showLeftPanel ? "Ẩn danh sách" : "Hiện danh sách"}
          >
            {showLeftPanel ? (
              <ChevronLeft size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>

          {showLeftPanel && (
            <div
              className="lesson-page__overlay lesson-page__overlay--visible"
              onClick={() => setShowLeftPanel(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default LessonContent;
