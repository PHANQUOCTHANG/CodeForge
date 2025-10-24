import React from "react";
import { Rate } from "antd";
import type { Review } from "@/features/course/types";
import { Star } from "lucide-react";

interface Props {
  reviewsRef: React.RefObject<HTMLDivElement | null>;
  reviews: Review[];
  rating: number;
  totalRatings: number;
}

export const CourseReviews: React.FC<Props> = ({
  reviewsRef,
  reviews,
  rating,
  totalRatings,
}) => {
  return (
    <div className="reviews-content" ref={reviewsRef}>
      <div className="reviews-header">
        <h2>Đánh giá từ học viên</h2>
        <div className="reviews-summary">
          <div className="rating-overview">
            <div className="rating-number">{rating}</div>
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={24}
                  fill={i < Math.floor(rating) ? "#fbbf24" : "none"}
                  color="#fbbf24"
                />
              ))}
            </div>
            <div className="rating-text">{totalRatings} đánh giá</div>
          </div>
        </div>
      </div>

      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review.userId} className="review-item">
            <img
              // src={review.avatar}
              alt={review.usename}
              className="review-avatar"
            />
            <div className="review-content">
              <div className="review-header">
                <h4>{review.usename}</h4>
                <span className="review-date">
                  {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="review-stars">
                <Rate disabled defaultValue={review.rating} />
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default CourseReviews;
