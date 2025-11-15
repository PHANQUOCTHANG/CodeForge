using CodeForge.Core.Entities;

namespace CodeForge.Core.Interfaces.Repositories
{
    public interface ILessonRepository
    {
        Task<Lesson?> GetByIdAsync(Guid lessonId);
        Task<List<Lesson>> GetByModuleIdAsync(Guid moduleId);
        Task<Lesson> AddAsync(Lesson lesson);
        Task<Lesson> UpdateAsync(Lesson lesson);
        Task DeleteAsync(Lesson lesson);

        /// <summary>
        /// Phương thức quan trọng: Lấy CourseId từ LessonId 
        /// để kiểm tra quyền sở hữu (Enrollment).
        /// </summary>
        Task<Guid?> GetCourseIdByLessonIdAsync(Guid lessonId);
    }
}