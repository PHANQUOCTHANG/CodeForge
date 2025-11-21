export interface ReviewDto {
  reviewId: string;
  courseId: string;
  user: UserSummaryDto;
  rating: number;
  comment?: string | null;
  createdAt: string;
  updatedAt: string;
}
export interface CreateReviewDto {
  rating: number;
  comment?: string | null;
}
export interface UpdateReviewDto {
  rating: number;
  comment?: string | null;
}
export interface UserSummaryDto {
  userId: string;
  username: string;
  avatarUrl?: string | null;
}
