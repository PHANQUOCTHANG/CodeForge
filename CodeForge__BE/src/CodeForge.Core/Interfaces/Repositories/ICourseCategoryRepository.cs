using CodeForge.Core.Entities;


namespace CodeForge.Core.Interfaces.Repositories
{
    public interface ICourseCategoryRepository
    {
        Task<List<CourseCategory>> GetAllAsync();
        Task<CourseCategory?> GetByIdAsync(Guid id);
        Task<CourseCategory> AddAsync(CourseCategory category);
        Task UpdateAsync(CourseCategory category); // Giả định category đã được theo dõi
        Task<bool> DeleteAsync(Guid id); // Xóa mềm (Soft Delete)
        Task<bool> ExistsByNameAsync(string name);
    }
}