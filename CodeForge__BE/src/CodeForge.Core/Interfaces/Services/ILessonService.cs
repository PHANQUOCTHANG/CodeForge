using CodeForge.Api.DTOs;
using CodeForge.Core.Entities;

namespace CodeForge.Core.Interfaces.Services
{
    public interface ILessonService
    {
        // ✅ Mới: Trả về kiểu dữ liệu chính khi thành công, ném Exception khi lỗi
        Task<LessonDto> CreateLessonAsync(CreateLessonDto createLessonDto);
        Task<bool> DeleteLessonAsync(Guid lessonId);
        Task<List<LessonDto>> GetAllLessonAsync();
        Task<LessonDto> GetLessonByIdAsync(Guid lessonId);
        Task<LessonDto> UpdateLessonAsync(UpdateLessonDto updateLessonDto);
    }

}