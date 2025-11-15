import React, { useState, useRef, useEffect } from "react";
import "./CourseLearningPage.scss";
import LessonSidebar from "@/features/course/components/course-learning/LessonSidebar";
import LessonHeader from "@/features/course/components/course-learning/LessonHeader";
import LessonContent from "@/features/course/components/course-learning/LessonContent";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { useCourseLesson } from "@/features/course/hooks/useCourseLesson";
import { useCourseDetail } from "@/features";
import { Button, Result, Spin } from "antd";
import { AxiosError } from "axios"; // Import AxiosError type
import NotFound from "@/pages/not-found/NotFound";

const CourseLearningPage = () => {
  const { slug, moduleId, lessonId } = useParams<{
    slug: string;
    moduleId: string;
    lessonId: string;
  }>(); // Assume IDs are always present
  const navigate = useNavigate(); // Hook for navigation

  // --- Resizer Logic (Keep as is) ---
  const [leftWidth, setLeftWidth] = useState(30);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null); // Add type for ref

  const handleMouseDown = (e: React.MouseEvent) => {
    // Add type for event
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    // Add type for event
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
  // --- End Resizer Logic ---

  // --- Data Fetching ---
  const {
    data: course,
    isLoading: isLoadingCourse,
    isError: isErrorCourse,
    error: errorCourse, // Get the detailed error object
  } = useCourseDetail(slug);

  const {
    data: lesson,
    isLoading: isLoadingLesson,
    isError: isErrorLesson,
    error: errorLesson, // Get the detailed error object
  } = useCourseLesson(lessonId);

  // --- Render Logic with Error Handling ---

  // 1. Loading State: Show spinner if *either* query is loading
  if (isLoadingCourse || isLoadingLesson) {
    return <Spin tip="Đang tải nội dung khóa học..." fullscreen />;
  }

  // 2. Not Found State: Check if *either* query returned a 404
  const courseNotFoundError =
    (errorCourse as AxiosError)?.response?.status === 404;
  const lessonNotFoundError =
    (errorLesson as AxiosError)?.response?.status === 404;

  if (courseNotFoundError || lessonNotFoundError) {
    // Log specific error for debugging
    console.error(
      courseNotFoundError
        ? `Course not found (slug: ${slug})`
        : `Lesson not found (id: ${lessonId})`
    );
    return (
      <Result
        status="404"
        title="404"
        subTitle="Xin lỗi! Trang của bạn không tồn tại"
        extra={
          <Button onClick={() => navigate("/")} type="primary">
            Trang chủ
          </Button>
        }
      />
    );
  }

  // 3. Other Error State: Handle any other error from either query
  if (isErrorCourse || isErrorLesson) {
    const errorToShow = (errorCourse || errorLesson) as AxiosError<any>; // Get the first error that occurred
    console.error("Lỗi khi tải dữ liệu học:", errorToShow);
    return (
      <Result
        status="500"
        title="500"
        subTitle="Xin lỗi! Đã có lỗi xảy ra"
        extra={
          <Button onClick={() => navigate("/")} type="primary">
            Trang chủ
          </Button>
        }
      />
    );
  }

  // 4. Data Not Available (Fallback, should ideally be caught by 404)
  if (!course || !lesson) {
    console.warn("Dữ liệu không tồn tại dù không có lỗi.");
    return <NotFound />; // Treat missing data also as Not Found
  }

  // --- Success State: Render the main content ---
  return (
    <div className="lesson-page" ref={containerRef}>
      <LessonHeader course={course} moduleId={moduleId} lessonId={lessonId} />
      <div className="lesson-page__main">
        {/* Conditional Sidebar (Example) */}
        {/* You might want a more robust way to manage sidebar visibility/content */}
        {/* {lesson?.lessonType === "coding" && <LessonSidebar />} */}

        {/* Resizer */}
        {/* <div
                    className="lesson-page__resizer"
                    onMouseDown={handleMouseDown}
                 >
                    <div className="lesson-page__resizer-handle"></div>
                 </div> */}

        <LessonContent
          lessonId={lessonId}
          moduleId={moduleId}
          course={course}
          lesson={lesson}
          // Pass resizer state if LessonContent needs it
          // leftWidth={leftWidth}
        />
      </div>
    </div>
  );
};

export default CourseLearningPage;
