import api from "@/api/axios";
import type { UpdateLessonProgressDto } from "@/features/progress/types/type";

export const progressApi = {
  /**
   * Cập nhật tiến độ học của một bài học
   */
  updateLessonProgress: async (data: UpdateLessonProgressDto) => {
    try {
      const response = await api.post("/progress/update", data);
 
      return response.data;
    } catch (error) {
      console.error("❌ Failed to update lesson progress:", error);
      throw error;
    }
  },

  /**
   * Lấy danh sách tiến độ học của user hiện tại
   */
  getUserProgress: async (courseId?: string) => {
    const response = await api.get("/progress", {
      params: { courseId },
    });
    return response.data;
  },

  /**
   * Đánh dấu hoàn thành bài học
   */
  markLessonCompleted: async (lessonId: string) => {
    const response = await api.post("/progress/complete", { lessonId });
    return response.data;
  },
};
