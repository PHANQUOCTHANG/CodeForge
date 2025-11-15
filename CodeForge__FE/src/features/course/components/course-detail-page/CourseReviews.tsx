import React, { useMemo, useState } from "react";
import { Empty, Rate, Spin } from "antd";

import { useAppSelector } from "@/app/store/store";
import { useCourseReview } from "@/features/course-review/hooks/useCourseReview";
import type { ReviewDto } from "@/features/course-review";
import { useParams } from "react-router-dom";
import type { CourseDetail } from "@/features/course/types";

interface Props {
  reviewsRef: React.RefObject<HTMLDivElement | null>;
  rating: number;
  totalRatings: number;
  course: CourseDetail;
}

export const CourseReviews: React.FC<Props> = ({
  reviewsRef,
  rating,
  totalRatings,
  course,
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState("");
  const { slug } = useParams();
  // 🧩 Gọi hook review
  const {
    reviews = [],
    isLoading,
    createReview,
    updateReview,
  } = useCourseReview(course.courseId, slug);
  console.log(reviews);
  // Tính lại ratingDistribution từ reviews
  const ratingDistribution = useMemo(() => {
    // Khởi tạo mảng 5 phần tử (1 → 5 sao)
    const counts = [0, 0, 0, 0, 0];

    // Đếm số lượng review cho từng mức sao
    reviews.forEach((r: ReviewDto) => {
      if (r.rating >= 1 && r.rating <= 5) {
        counts[r.rating - 1]++;
      }
    });

    const total = reviews.length || 1;

    // Tạo mảng từ 5 → 1 sao (để hiển thị từ cao xuống thấp)
    return [5, 4, 3, 2, 1].map((star) => ({
      stars: star,
      count: counts[star - 1], // 👈 số lượng thực tế
      percentage: Math.round((counts[star - 1] / total) * 100),
    }));
  }, [reviews]);

  // Kiểm tra user đã review chưa
  const userReview = useMemo(
    () =>
      user
        ? reviews.find((r: ReviewDto) => r.user.userId === user.userId)
        : null,
    [user, reviews]
  );
  const hasReviewed = !!userReview;
  // 🟢 Gửi hoặc cập nhật đánh giá
  const handleSubmitReview = () => {
    if (!user || !userComment.trim() || !userRating) return;
    if (hasReviewed) {
      updateReview.mutate({
        reviewId: userReview.reviewId,
        payload: {
          comment: userComment,
          rating: userRating,
        },
      });
    } else {
      createReview.mutate({
        comment: userComment,
        rating: userRating,
      });
    }
    setUserRating(5);
    setUserComment("");
  };
  console.log(reviews);
  // Khi đã review thì hiển thị lại nội dung cũ
  React.useEffect(() => {}, [hasReviewed, userReview, reviews]);

  return (
    <div className="reviews-content" ref={reviewsRef}>
      <h2 className="reviews-title">Đánh giá</h2>

      {/* Tổng quan đánh giá */}
      <div className="reviews-summary">
        <div className="rating-overview">
          <div className="rating-score">
            <div className="rating-number">{rating}</div>
            <Rate allowHalf value={rating} />
            <div className="rating-text">({totalRatings} đánh giá)</div>
          </div>
          {totalRatings > 0 && (
            <div className="rating-bars">
              {ratingDistribution
                .filter((item) => item.percentage > 0)
                .map((item) => (
                  <div key={item.stars} className="rating-bar-item">
                    <span className="star-label">{item.stars} sao</span>
                    <div className="bar-container">
                      <div
                        className="bar-fill"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="percentage">{item.percentage}%</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Form đánh giá */}
      {user && course.isEnrolled && (
        <div className="review-form">
          <div className="form-header">
            <div className="user-rating">
              <span>Đánh giá của bạn</span>
            </div>
          </div>
          <textarea
            className="review-input"
            placeholder="Nhập đánh giá của bạn..."
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
          />
          <div className="form-footer">
            <Rate
              value={userRating}
              onChange={setUserRating}
              className="rating-stars"
            />
            <button
              className="submit-button"
              onClick={handleSubmitReview}
              disabled={!userRating || !userComment.trim()}
            >
              Gửi đánh giá
            </button>
          </div>
        </div>
      )}

      {/* Danh sách review */}
      <div className="reviews-list">
        {isLoading ? (
          <Spin size="large" fullscreen />
        ) : reviews.length === 0 ? (
          <Empty />
        ) : (
          reviews.map((review: ReviewDto) => (
            <div key={review.reviewId} className="review-item">
              <div className="review-avatar">
                {review.user.username?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="review-content">
                <div className="review-header">
                  <div className="review-info">
                    <h4 className="review-username">{review.user.username}</h4>
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div className="review-stars">
                    <Rate disabled defaultValue={review.rating} />
                  </div>
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseReviews;
