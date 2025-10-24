import React, { useState, useRef, useEffect } from "react";
import "./CourseLearningPage.scss";
import LessonSidebar from "@/features/course/components/course-learning/LessonSidebar";
import LessonHeader from "@/features/course/components/course-learning/LessonHeader";

const CourseLearningPage = () => {
  const [leftWidth, setLeftWidth] = useState(30);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
    if (newWidth >= 20 && newWidth <= 60) setLeftWidth(newWidth);
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    };
  }, [isDragging]);

  return (
    <div className="lesson-page" ref={containerRef}>
      {/* Sidebar nhỏ cố định bên trái */}

      {/* Nội dung chính */}
      <LessonHeader />
      <div className="lesson-page__main">
        <LessonSidebar />

        <div className="lesson-page__content">
          {/* Panel trái: danh sách bài */}
          <div
            className="lesson-page__left-panel"
            style={{ width: `${leftWidth}%` }}
          >
            {/* TODO: render list lesson */}
            oce
          </div>

          {/* Thanh resize giữa */}
          <div className="lesson-page__resizer" onMouseDown={handleMouseDown}>
            <div className="lesson-page__resizer-handle"></div>
          </div>

          {/* Panel phải: nội dung học */}
          <div
            className="lesson-page__right-panel"
            style={{ width: `${100 - leftWidth}%` }}
          >
            {/* TODO: render content */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearningPage;
