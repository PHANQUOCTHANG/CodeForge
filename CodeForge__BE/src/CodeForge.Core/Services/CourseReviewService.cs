using AutoMapper;
using CodeForge.Core.Entities;
using CodeForge.Core.Exceptions;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Core.Interfaces.Services;

using CodeForge.Api.DTOs.Response;
using CodeForge.Api.DTOs.Request.Enrollment; // Giả định DTOs Review nằm ở đây
// Giả định CourseReviewDto, CreateReviewDto, UpdateReviewDto đã được định nghĩa
// Giả định IReviewRepository có GetByIdAsync, AddAsync, UpdateAsync, DeleteAsync


namespace CodeForge.Core.Service
{
    public class CourseReviewService : ICourseReviewService
    {
        private readonly ICourseReviewRepository _reviewRepository;
        private readonly ICourseRepository _courseRepository;
        private readonly IMapper _mapper;

        public CourseReviewService(ICourseReviewRepository reviewRepository, ICourseRepository courseRepository, IMapper mapper)
        {
            _reviewRepository = reviewRepository;
            _courseRepository = courseRepository;
            _mapper = mapper;
        }

        // ========================================================
        // 🟢 CREATE REVIEW (Tạo mới)
        // ========================================================
        public async Task<CourseReviewDto> CreateReviewAsync(Guid userId, CreateReviewDto dto)
        {
            // 1. Kiểm tra đã đánh giá khóa học này chưa (Conflict 409)
            if (await _reviewRepository.GetReviewByUserAndCourseAsync(userId, dto.CourseId) != null)
                throw new ConflictException("User has already reviewed this course.");

            // 2. Tải Course (Bắt buộc)
            var courseToUpdate = await _courseRepository.GetByIdAsync(dto.CourseId);
            if (courseToUpdate == null)
                throw new NotFoundException($"Course with ID {dto.CourseId} not found.");

            // 3. Tạo Entity Review
            var review = _mapper.Map<CourseReview>(dto);
            review.UserId = userId;

            // 4. LƯU REVIEW VÀ CẬP NHẬT THỐNG KÊ (Atomic Operation)

            // Tăng tổng số đánh giá (TotalRatings)
            courseToUpdate.TotalRatings += 1;

            // Tính toán Rating mới (Cập nhật Lũy tiến)
            courseToUpdate.Rating = CalculateNewRatingOnCreate(
                courseToUpdate.Rating,
                courseToUpdate.TotalRatings,
                review.Rating
            );

            // 5. Lưu Review và Cập nhật Course
            var newReview = await _reviewRepository.AddAsync(review);
            await _courseRepository.UpdateCourseOnlyAsync(courseToUpdate);

            // 6. Trả về DTO
            return _mapper.Map<CourseReviewDto>(newReview);
        }

        // ========================================================
        // 🟡 UPDATE REVIEW (Cập nhật)
        // ========================================================
        public async Task<CourseReviewDto> UpdateReviewAsync(Guid userId, Guid reviewId, UpdateReviewDto dto)
        {
            var reviewToUpdate = await _reviewRepository.GetByIdAsync(reviewId);
            if (reviewToUpdate == null)
                throw new NotFoundException($"Review with ID {reviewId} not found.");

            // Xác minh quyền sở hữu (Forbidden 403)
            if (reviewToUpdate.UserId != userId)
                throw new ForbiddenException("You do not have permission to update this review.");

            // 1. Tải Course
            var courseToUpdate = await _courseRepository.GetByIdAsync(reviewToUpdate.CourseId);
            if (courseToUpdate == null)
                throw new NotFoundException($"Referenced course not found (ID: {reviewToUpdate.CourseId}).");

            // 2. LƯU GIÁ TRỊ CŨ (trước khi ánh xạ)
            var oldRatingValue = reviewToUpdate.Rating;

            // 3. Ánh xạ DTO (cập nhật reviewToUpdate.Rating)
            _mapper.Map(dto, reviewToUpdate);
            Console.WriteLine(courseToUpdate.Rating);
            Console.WriteLine(courseToUpdate.TotalRatings);
            Console.WriteLine(oldRatingValue);
            Console.WriteLine(reviewToUpdate.Rating);
            // 4. Tính toán Rating mới
            courseToUpdate.Rating = CalculateNewRatingOnUpdate(
                courseToUpdate.Rating,
                courseToUpdate.TotalRatings, // TotalRatings không đổi khi update
                oldRatingValue,
                reviewToUpdate.Rating // Giá trị Rating mới
            );

            // 5. Lưu Review và Cập nhật Course
            var updatedReview = await _reviewRepository.UpdateAsync(reviewToUpdate);
            await _courseRepository.UpdateCourseOnlyAsync(courseToUpdate);

            return _mapper.Map<CourseReviewDto>(updatedReview);
        }

        // ========================================================
        // 🔴 DELETE REVIEW (Xóa)
        // ========================================================
        public async Task<bool> DeleteReviewAsync(Guid userId, Guid reviewId)
        {
            var reviewToDelete = await _reviewRepository.GetByIdAsync(reviewId);

            if (reviewToDelete == null)
                throw new NotFoundException($"Review with ID {reviewId} not found.");

            if (reviewToDelete.UserId != userId)
                throw new ForbiddenException("You do not have permission to delete this review.");

            // 1. Tải Course
            var courseToUpdate = await _courseRepository.GetByIdAsync(reviewToDelete.CourseId);
            if (courseToUpdate == null)
                throw new Exception("Referenced course not found during deletion.");

            // 2. Tính toán Rating mới sau khi xóa
            double newRatingValue = CalculateNewRatingOnDelete(
                courseToUpdate.Rating,
                courseToUpdate.TotalRatings,
                reviewToDelete.Rating // Giá trị Rating bị xóa
            );

            // 3. Xóa Review
            bool deleted = await _reviewRepository.DeleteAsync(reviewId);

            if (!deleted)
                throw new Exception("Database failed to delete the review record.");

            // 4. Cập nhật Course: Giảm TotalRatings và gán Rating mới
            courseToUpdate.TotalRatings -= 1;
            courseToUpdate.Rating = newRatingValue;
            await _courseRepository.UpdateCourseOnlyAsync(courseToUpdate);

            return true;
        }

        // ========================================================
        // 📚 GET REVIEWS (Đã có logic)
        // ========================================================
        public async Task<List<CourseReviewDto>> GetReviewsByCourseIdAsync(Guid courseId)
        {
            var reviews = await _reviewRepository.GetReviewsByCourseIdAsync(courseId);
            return _mapper.Map<List<CourseReviewDto>>(reviews);
        }


        // ========================================================
        // 📊 HÀM HELPER TÍNH TOÁN RATING (Sử dụng Double cho tính toán)
        // ========================================================

        private double CalculateNewRatingOnCreate(double currentAvg, int newTotalCount, int newRating)
        {
            // totalCount ở đây đã bao gồm đánh giá mới
            double oldTotalCount = (double)newTotalCount - 1;

            // Công thức: (Tổng điểm cũ + Điểm mới) / Tổng số lượng mới
            double oldTotalSum = currentAvg * oldTotalCount;

            return (oldTotalSum + newRating) / (double)newTotalCount;
        }

        private double CalculateNewRatingOnUpdate(double currentAvg, int totalCount, int oldRating, int newRating)
        {
            if (totalCount == 0) return 0;

            double totalCountDouble = (double)totalCount;
            double oldTotalSum = currentAvg * totalCountDouble;
            double newTotalSum = oldTotalSum - oldRating + newRating;

            return newTotalSum / totalCountDouble;
        }

        private double CalculateNewRatingOnDelete(double currentAvg, int totalCount, int deletedRating)
        {
            double totalCountDouble = (double)totalCount; // Tổng cũ

            if (totalCountDouble <= 1) return 0; // Nếu chỉ còn 1 hoặc 0, trung bình mới là 0

            double oldTotalSum = currentAvg * totalCountDouble;
            double newTotalSum = oldTotalSum - deletedRating;

            return newTotalSum / (totalCountDouble - 1); // Chia cho số lượng mới
        }
    }
}