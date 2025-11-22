// src/features/courseReview/hooks/useCourseReview.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { openNotification } from "@/common/helper/notification";
import type {
  CreateReviewDto,
  UpdateReviewDto,
  ReviewDto,
} from "@/features/course-review/types";
import courseReviewApi from "@/features/course-review/services/courseReviewService";

/**
 * Hook quản lý Review (đánh giá) của khóa học
 */
export const useCourseReview = (courseId: string, slug: string | undefined) => {
  const queryClient = useQueryClient();
  // 🟢 Lấy tất cả review
  const {
    data: reviews,
    isLoading,
    isError,
    error,
  } = useQuery<ReviewDto[]>({
    queryKey: ["courseReviews", courseId],
    queryFn: () => courseReviewApi.getReviews(courseId),
    enabled: !!courseId, // chỉ chạy khi có courseId
    select: (apiResponse) => apiResponse.data,
  });

  // 🟣 Gửi review mới
  const createReview = useMutation({
    mutationFn: (payload: CreateReviewDto) =>
      courseReviewApi.createReview(courseId, payload),
    onSuccess: () => {
      openNotification(
        "success",
        "Thành công",
        "Đánh giá của bạn đã được gửi!"
      );
      queryClient.invalidateQueries({ queryKey: ["courseReviews", courseId] });
      queryClient.invalidateQueries({ queryKey: ["course", slug] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (err: any) => {
      openNotification(
        "error",
        "Thất bại",
        err?.response?.data?.message || "Không thể gửi đánh giá."
      );
    },
  });

  // 🟠 Cập nhật review
  const updateReview = useMutation({
    mutationFn: (params: { reviewId: string; payload: UpdateReviewDto }) =>
      courseReviewApi.updateReview(courseId, params.reviewId, params.payload),

    onSuccess: () => {
      openNotification("success", "Đã cập nhật", "Đánh giá đã được cập nhật!");
      queryClient.invalidateQueries({
        queryKey: ["courseReviews", courseId],
        exact: true,
      });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", slug] });
      // ⚡ ép React Query fetch lại ngay lập tức
      queryClient.refetchQueries({
        queryKey: ["courseReviews", courseId],
        exact: true,
      });
    },
    onError: (err: any) => {
      openNotification(
        "error",
        "Thất bại",
        err?.response?.data?.message || "Không thể cập nhật đánh giá."
      );
    },
  });

  // 🔴 Xóa review
  const deleteReview = useMutation({
    mutationFn: (reviewId: string) =>
      courseReviewApi.deleteReview(courseId, reviewId),
    onSuccess: () => {
      openNotification("success", "Đã xoá", "Đánh giá của bạn đã được xoá!");
      queryClient.invalidateQueries({ queryKey: ["courseReviews", courseId] });
      queryClient.invalidateQueries({ queryKey: ["course", slug] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (err: any) => {
      openNotification(
        "error",
        "Thất bại",
        err?.response?.data?.message || "Không thể xoá đánh giá."
      );
    },
  });

  return {
    reviews,
    isLoading,
    isError,
    error,
    createReview,
    updateReview,
    deleteReview,
  };
};
