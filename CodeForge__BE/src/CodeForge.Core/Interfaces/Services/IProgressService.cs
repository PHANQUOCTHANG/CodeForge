using CodeForge.Application.DTOs.Response;

namespace CodeForge.Core.Services
{
    public interface IProgressService
    {
        /// <summary>
        /// Tạo hoặc cập nhật (UPSERT) trạng thái tiến độ của một bài học.
        /// </summary>
        Task<ProgressDto> UpdateProgressAsync(Guid userId, Guid lessonId, string status);

        /// <summary>
        /// Lấy danh sách các bài học đã hoàn thành cho một khóa học cụ thể.
        /// </summary>
        Task<List<ProgressDto>> GetProgressForCourseAsync(Guid userId, Guid courseId);

        /// <summary>
        /// Lấy tóm tắt tiến độ (% hoàn thành) cho tất cả các khóa học đã đăng ký.
        /// </summary>
        Task<Dictionary<Guid, double>> GetUserProgressSummaryAsync(Guid userId);
    }
}