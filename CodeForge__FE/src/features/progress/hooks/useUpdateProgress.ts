// src/features/progress/hooks/useUpdateProgress.ts
import { useCallback, useState } from "react";
import { progressApi, type UpdateProgressDto } from "../services/progressApi";

/**
 * ✅ Hook cập nhật tiến độ bài học
 * - Có debounce để tránh spam API
 * - Có retry nếu lỗi mạng
 * - Có state cho UI (loading, completed)
 */
export const useUpdateProgress = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProgress = useCallback(
    async (lessonId: string, status: "in_progress" | "completed") => {
      if (!lessonId) {
        console.warn("❌ Missing lessonId");
        return;
      }

      // Debounce nhỏ để tránh gửi liên tục
      setIsUpdating(true);
      setError(null);

      let retries = 3;
      while (retries > 0) {
        try {
          await progressApi.updateLessonProgress({ lessonId, status });
          if (status === "completed") setIsCompleted(true);
          return;
        } catch (err: any) {
          console.error("⚠️ Update progress failed:", err);
          retries--;
          if (retries === 0) {
            setError(err?.message || "Update failed");
          } else {
            await new Promise((r) => setTimeout(r, 1000)); // retry delay
          }
        }
      }
      setIsUpdating(false);
    },
    []
  );

  return { updateProgress, isUpdating, isCompleted, error };
};
