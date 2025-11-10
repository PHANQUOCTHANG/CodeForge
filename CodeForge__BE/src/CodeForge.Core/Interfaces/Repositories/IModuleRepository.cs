using CodeForge.Core.Entities;

namespace CodeForge.Core.Interfaces.Repositories
{
    public interface IModuleRepository
    {
        Task<Module?> GetByIdAsync(Guid moduleId);
        Task<List<Module>> GetByCourseIdAsync(Guid courseId);
        Task<Module> AddAsync(Module module);
        Task<Module> UpdateAsync(Module module);
        Task DeleteAsync(Module module);

        /// <summary>
        /// Lấy CourseId từ ModuleId (Dùng để kiểm tra quyền).
        /// </summary>
        Task<Guid?> GetCourseIdByModuleIdAsync(Guid moduleId);

        /// <summary>
        /// Lấy ModuleId và CourseId từ LessonId (Dùng để kiểm tra quyền).
        /// </summary>
        Task<(Guid? ModuleId, Guid? CourseId)> GetModuleAndCourseIdsByLessonIdAsync(Guid lessonId);
    }
}