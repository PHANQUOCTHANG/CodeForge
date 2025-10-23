
using CodeForge.Api.DTOs.Response;
using CodeForge.Api.DTOs.Request.Course;
using CodeForge.Core.Models;
using CodeForge.Application.DTOs.Courses;
using CodeForge.Api.DTOs;


namespace CodeForge__BE.src.CodeForge.Core.Interfaces.Services
{
    public interface ICourseService
    {
        Task<PaginationResult<object>> GetPagedCoursesAsync(
            int page, int pageSize, string? search);
        Task<List<CourseDto>> GetAllCourseAsync(QueryParameters query);
        Task<CourseDto> GetCourseByIdAsync(Guid courseId);
        Task<CourseDetailDto?> GetCourseDetailBySlugAsync(string slug);

        Task<CourseDto> UpdateCourseAsync(UpdateCourseDto updateCourseDto);
        Task<CourseDto> CreateCourseAsync(CreateCourseDto createCourseDto);
        Task<bool> DeleteCourseAsync(Guid courseId);
    }
}