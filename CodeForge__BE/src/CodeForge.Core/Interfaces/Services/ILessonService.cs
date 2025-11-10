using CodeForge.Application.DTOs.Lessons;
using CodeForge.Application.DTOs.Response;

namespace CodeForge.Core.Services
{
    public interface ILessonService
    {
        /// <summary>
        /// Lấy chi tiết bài học.
        /// </summary>
        Task<LessonDto> GetLessonDetailAsync(Guid lessonId, Guid userId);

        /// <summary>
        /// Lấy danh sách bài học (tóm tắt) của một module.
        /// </summary>
        Task<List<LessonDto>> GetLessonsByModuleAsync(Guid moduleId, Guid userId);

        /// <summary>
        /// Tạo bài học mới (bao gồm cả nội dung).
        /// </summary>
        Task<LessonDto> CreateLessonAsync(CreateLessonDto createDto, Guid userId);

        // ... Các phương thức Update/Delete
    }
}