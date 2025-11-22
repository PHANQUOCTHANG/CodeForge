
using CodeForge.Core.Entities;
using CodeForge.Api.DTOs.Request.Course;

namespace CodeForge.Core.Interfaces.Repositories
{
    public interface ICourseRepository
    {
        //
        Task<(IEnumerable<Course> Data, int TotalItems)> GetPagedCoursesAsync(
            int page, int pageSize, string? search, string? level, string? status);
        Task<List<Course>> GetAllAsync(QueryParameters query);
        Task<Dictionary<Guid, double>> GetUserCourseProgressAsync(Guid userId);
        Task<Course?> GetByIdAsync(Guid courseId);
        Task<Course?> GetBySlugAsync(string slug);
        Task<Course?> GetCourseByIdWithDeletedAsync(Guid courseId);
        Task<Course?> UpdateAsync(UpdateCourseDto updateCourseDto);
        Task<Course> CreateAsync(CreateCourseDto createCourseDto);
        Task<bool> DeleteAsync(Guid courseId);
        Task<Course> AddAsync(Course course); // MỚI: Chỉ thêm vào context
        Task<bool> ExistsByTitleAsync(string title);
        Task<bool> ExistsBySlugAsync(string slug);
        Task UpdateCourseOnlyAsync(Course course);
    }

}