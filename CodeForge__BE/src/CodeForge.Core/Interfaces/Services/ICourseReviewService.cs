using CodeForge.Api.DTOs.Request.Enrollment;
using CodeForge.Api.DTOs.Response;


namespace CodeForge.Core.Interfaces.Services
{
    public interface ICourseReviewService
    {
        // Tạo đánh giá mới (Cần userId từ token)
        Task<CourseReviewDto> CreateReviewAsync(Guid userId, CreateReviewDto dto);

        // Cập nhật đánh giá (Cần userId từ token để xác minh quyền sở hữu)
        Task<CourseReviewDto> UpdateReviewAsync(Guid userId, Guid reviewId, UpdateReviewDto dto);

        // Xóa đánh giá (Cần userId từ token)
        Task<bool> DeleteReviewAsync(Guid userId, Guid reviewId);

        // Lấy tất cả đánh giá cho một khóa học (Công khai)
        Task<List<CourseReviewDto>> GetReviewsByCourseIdAsync(Guid courseId);
    }
}