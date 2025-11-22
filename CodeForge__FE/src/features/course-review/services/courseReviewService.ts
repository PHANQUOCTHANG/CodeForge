import api from "@/api/axios";
import type { ApiResponse } from "@/common/types";
import type {
  ReviewDto,
  CreateReviewDto,
  UpdateReviewDto,
} from "@/features/course-review/types";

const courseReviewApi = {
  // 🟢 Lấy danh sách review của course
  getReviews: async (courseId: string): Promise<ApiResponse<ReviewDto[]>> => {
    const res = await api.get<ApiResponse<ReviewDto[]>>(
      `/courses/${courseId}/reviews`
    );
    return res.data;
  },

  // 🟣 Tạo review mới
  createReview: async (
    courseId: string,
    payload: CreateReviewDto
  ): Promise<ApiResponse<ReviewDto>> => {
    const res = await api.post<ApiResponse<ReviewDto>>(
      `/courses/${courseId}/reviews`,
      payload
    );
    return res.data;
  },

  // 🟠 Cập nhật review
  updateReview: async (
    courseId: string,
    reviewId: string,
    payload: UpdateReviewDto
  ): Promise<ApiResponse<ReviewDto>> => {
    const res = await api.patch<ApiResponse<ReviewDto>>(
      `/courses/${courseId}/reviews/${reviewId}`,
      payload
    );
    return res.data;
  },

  // 🔴 Xóa review
  deleteReview: async (
    courseId: string,
    reviewId: string
  ): Promise<ApiResponse<null>> => {
    const res = await api.delete<ApiResponse<null>>(
      `/courses/${courseId}/reviews/${reviewId}`
    );
    return res.data;
  },
};

export default courseReviewApi;
