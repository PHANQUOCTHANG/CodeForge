using CodeForge.Core.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CodeForge.Core.Interfaces.Repositories
{
    public interface ICourseReviewRepository
    {
        // Thêm đánh giá mới
        Task<CourseReview> AddAsync(CourseReview review);

        // Lấy tất cả đánh giá cho một khóa học (cần thiết cho trang chi tiết)
        Task<List<CourseReview>> GetReviewsByCourseIdAsync(Guid courseId);

        // Lấy đánh giá của một người dùng cho một khóa học (để kiểm tra xem đã đánh giá chưa)
        Task<CourseReview?> GetReviewByUserAndCourseAsync(Guid userId, Guid courseId);

        // Cập nhật đánh giá
        Task<CourseReview?> UpdateAsync(CourseReview review);

        // Xóa đánh giá (trả về true nếu xóa thành công)
        Task<bool> DeleteAsync(Guid reviewId);

        // Lưu thay đổi (đã có trong AuthRepository, có thể tái sử dụng hoặc thêm vào Base Repository)
        Task SaveChangesAsync();
        Task<CourseReview?> GetByIdAsync(Guid reviewId);

    }
}