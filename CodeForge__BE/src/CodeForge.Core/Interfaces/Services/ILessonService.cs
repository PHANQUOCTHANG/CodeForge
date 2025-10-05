using CodeForge.Api.DTOs;
using CodeForge.Core.Entities;

namespace CodeForge.Core.Interfaces.Services
{
    public interface ILessonService
    {
        Task<ApiResponse<List<LessonDto>>> GetAllLessonAsync();
        Task<ApiResponse<LessonDto>> GetLessonByIdAsync(Guid lessonId);

        Task<ApiResponse<LessonDto>> UpdateLessonAsync(UpdateLessonDto updateLessonDto);
        Task<ApiResponse<LessonDto>> CreateLessonAsync(CreateLessonDto createLessonDto);
        Task<ApiResponse<bool>> DeleteLessonAsync(Guid lessonId);
    }
}