using CodeForge.Api.DTOs;
using CodeForge.Core.Entities;

namespace CodeForge.Core.Interfaces.Repositories
{
    public interface ILessonRepository
    {
        Task<List<Lesson>> GetAllAsync();
        Task<Lesson?> GetByIdAsync(Guid lessonId);

        Task<Lesson?> UpdateAsync(UpdateLessonDto updateLessonDto);
        Task<Lesson> CreateAsync(CreateLessonDto createLessonDto);

        Task<bool> DeleteAsync(Guid lessonId);

        Task<bool> ExistsByTitle(string title);
    }
}