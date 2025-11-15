import React, { useEffect, useRef, useState } from "react";
import type { LessonDto } from "@/features/course/types";
import { useUpdateProgress } from "@/features/progress/hooks/useUpdateProgress";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

interface TextContentProps {
  lesson: LessonDto;
}

// ⏱ Đã giảm xuống 10s trong code ban đầu, giữ nguyên.
const COMPLETION_TIME = 10;

const TextContent: React.FC<TextContentProps> = ({ lesson }) => {
  const queryClient = useQueryClient();
  const { slug } = useParams();
  const { updateProgress } = useUpdateProgress();
  // 💡 Dùng state để theo dõi thời gian và buộc re-render
  const [timeElapsed, setTimeElapsed] = useState(0);
  // 💡 Dùng ref để lưu trữ ID của interval, không gây re-render
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 💡 Lấy giá trị đã hoàn thành từ lesson prop
  const alreadyCompleted = lesson.isCompleted;

  // 1. ⏱ EFFECT: Quản lý bộ đếm thời gian
  useEffect(() => {
    // 🚧 Guard: Không chạy nếu không có lessonId hoặc đã hoàn thành
    if (!lesson?.lessonId || alreadyCompleted) {
      // Đảm bảo không có interval cũ nào đang chạy khi component re-render
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // 💡 Reset thời gian khi lessonId thay đổi (chuyển bài)
    setTimeElapsed(0);

    // Bắt đầu interval
    intervalRef.current = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    // 🧹 Cleanup: Xóa interval khi component unmount hoặc lessonId/alreadyCompleted thay đổi
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [lesson.lessonId, alreadyCompleted]); // Chỉ phụ thuộc vào ID bài học và trạng thái hoàn thành

  // 2. ✅ EFFECT: Tự động đánh dấu hoàn thành
  useEffect(() => {
    // 🚧 Guard: Không chạy nếu không có lessonId, đã hoàn thành, hoặc chưa đủ thời gian
    if (
      !lesson?.lessonId ||
      alreadyCompleted ||
      timeElapsed < COMPLETION_TIME
    ) {
      return;
    }

    // BUG FIX: Dừng interval ngay lập tức khi đủ thời gian để tránh lặp lại
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Gọi API update
    updateProgress(lesson.lessonId, "completed")
      .then(() => {
        // Sau khi update thành công (hoặc ít nhất là đã gọi API), thông báo cho Redux
        queryClient.invalidateQueries(["course", slug]);
        queryClient.invalidateQueries(["lessons", lesson.lessonId]);
      })
      .catch((err) => {
        console.error("❌ Failed to update progress:", err);
      });

    // 💡 Không cần cleanup vì đã dừng interval ở trên
  }, [
    timeElapsed,
    alreadyCompleted,
    lesson.lessonId,
    updateProgress,
    queryClient,
    slug,
  ]);

  // 🧱 Render nội dung
  if (!lesson?.textContent) {
    return (
      <div className="lesson-content__empty">Không có nội dung văn bản</div>
    );
  }

  return (
    <div className="lesson-content__text relative">
      <div className="lesson-content__progress-info mb-2">
        {alreadyCompleted ? (
          <p className="text-green-500 font-semibold">
            ✅ Đã hoàn thành bài học!
          </p>
        ) : (
          <p>
            ⏳ Đang đọc... ({timeElapsed}/{COMPLETION_TIME}s)
          </p>
        )}
      </div>

      <div
        className="lesson-content__text-body"
        // Thận trọng với dangerouslySetInnerHTML, đảm bảo nguồn nội dung là an toàn
        dangerouslySetInnerHTML={{ __html: lesson.textContent.content }}
      />
    </div>
  );
};

export default TextContent;
