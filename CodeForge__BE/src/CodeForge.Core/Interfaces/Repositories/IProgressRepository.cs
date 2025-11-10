using CodeForge.Core.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CodeForge.Core.Interfaces.Repositories
{
    /// <summary>
    /// Interface cho repository quản lý tiến độ (Progress) của người dùng.
    /// </summary>
    public interface IProgressRepository
    {
        /// <summary>
        /// Tìm một bản ghi tiến độ theo UserId và LessonId.
        /// </summary>
        Task<Progress?> GetByUserIdAndLessonIdAsync(Guid userId, Guid lessonId);

        /// <summary>
        /// Thêm mới một bản ghi tiến độ.
        /// </summary>
        Task<Progress> AddAsync(Progress progress);

        /// <summary>
        /// Cập nhật một bản ghi tiến độ.
        /// </summary>
        Task<Progress> UpdateAsync(Progress progress);

        /// <summary>
        /// Lấy tất cả các bản ghi tiến độ (đã hoàn thành) của người dùng cho một khóa học.
        /// </summary>
        Task<List<Progress>> GetCompletedProgressForCourseAsync(Guid userId, Guid courseId);

        /// <summary>
        /// Chạy truy vấn phức tạp để tính toán % hoàn thành cho tất cả các khóa học
        /// mà người dùng đã tham gia (có bài học).
        /// </summary>
        Task<Dictionary<Guid, double>> GetUserProgressSummaryAsync(Guid userId);
    }
}