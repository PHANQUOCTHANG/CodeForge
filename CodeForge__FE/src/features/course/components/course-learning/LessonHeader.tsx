import React, { useMemo } from "react";
import type { CourseDetail } from "@/features/course/types";
import { ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom"; // 1. Import hook điều hướng
import Swal from "sweetalert2";

interface Props {
  course: CourseDetail | undefined; // 2. Cho phép course có thể undefined (khi đang tải)
  moduleId: string | undefined;
  lessonId: string | undefined;
}

const LessonHeader: React.FC<Props> = ({ course, moduleId, lessonId }) => {
  const navigate = useNavigate(); // 3. Khởi tạo hook

  // 4. Lấy dữ liệu an toàn, dùng useMemo để tối ưu
  const { sortedModules, selectedModule, courseSlug } = useMemo(() => {
    const modules = course?.modules || [];
    const courseSlug = course?.slug || "";

    // 5. FIX: Luôn sắp xếp để đảm bảo logic tính toán đúng
    const sortedModules = [...modules].sort(
      (a, b) => a.orderIndex - b.orderIndex
    );

    const selectedModule = sortedModules.find(
      (module) => module.moduleId === moduleId
    );

    const selectedLesson = selectedModule?.lessons.find(
      (lesson) => lesson.lessonId === lessonId
    );

    return { sortedModules, selectedModule, selectedLesson, courseSlug };
  }, [course, moduleId, lessonId]);

  // 6. Tính toán giá trị bắt đầu (giữ logic của bạn, nhưng dùng mảng đã sắp xếp)
  const startVal = useMemo(() => {
    let res = 0;
    for (const i of sortedModules) {
      if (i.moduleId === moduleId) {
        break;
      } else {
        res += i.lessons.length;
      }
    }
    return res;
  }, [sortedModules, moduleId]);

  // --- 7. Thêm các hàm xử lý điều hướng ---
  const handleBackClick = () => {
    if (courseSlug) {
      navigate(`/courses/${courseSlug}`); // Về trang tổng quan khóa học
    }
  };

  const handlePageClick = (newLessonId: string) => {
    Swal.fire({
      title: "Xác nhận?",
      text: "Bạn có muốn chuyển đến bài khác?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có",
      cancelButtonText: "Không",
    }).then((result) => {
      if (result.isConfirmed) {
        if (courseSlug && moduleId) {
          navigate(`/courses/${courseSlug}/learn/${moduleId}/${newLessonId}`);
        }
      }
    });
  };

  // --- 8. Render ---
  if (!course || !selectedModule) {
    // Trả về header rỗng trong khi tải
    return <header className="lesson-page__header" />;
  }

  return (
    <>
      <header className="lesson-page__header">
        <div className="lesson-page__header-left">
          {/* FIX 1: Thêm onClick cho nút Back */}
          <button className="lesson-page__back-btn" onClick={handleBackClick}>
            <ArrowLeft />
          </button>
          {/* FIX 2: Hiển thị tên bài học động */}
          <p className="lesson-page__header-title">{course?.title || "..."}</p>
        </div>
        <div className="lesson-page__page-numbers">
          {/* FIX 3: Sắp xếp lessons trước khi map */}
          {selectedModule.lessons
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((lesson) => {
              // Giả sử orderIndex là 1-based (1, 2, 3...)
              const num = startVal + lesson.orderIndex;

              return (
                <button
                  key={lesson.lessonId} // Dùng ID làm key
                  onClick={() => handlePageClick(lesson.lessonId)}
                  className={`lesson-page__page-number ${
                    lesson.lessonId === lessonId
                      ? "lesson-page__page-number--active"
                      : ""
                  }`}
                >
                  {lesson.isCompleted ? <Check size={16} /> : num}
                </button>
              );
            })}
        </div>
      </header>
    </>
  );
};

export default LessonHeader;
