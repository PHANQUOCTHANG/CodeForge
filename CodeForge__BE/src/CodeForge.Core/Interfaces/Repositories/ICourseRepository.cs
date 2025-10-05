
using CodeForge.Core.Entities;
using CodeForge.Api.DTOs.Request.Course;

namespace CodeForge.Core.Interfaces.Repositories
{
    public interface ICourseRepository
    {
        Task<List<Course>> GetAllAsync(QueryParameters query);
        Task<Course?> GetByIdAsync(Guid courseId);

        Task<Course?> UpdateAsync(UpdateCourseDto updateCourseDto);
        Task<Course> CreateAsync(CreateCourseDto createCourseDto);

        Task<bool> DeleteAsync(Guid courseId);

        Task<bool> ExistsByTitle(string title);
    }

}