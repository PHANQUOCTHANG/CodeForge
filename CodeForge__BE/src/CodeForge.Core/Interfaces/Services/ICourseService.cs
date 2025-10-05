
using CodeForge.Api.DTOs.Response;
using CodeForge.Api.DTOs.Request.Course;


namespace CodeForge__BE.src.CodeForge.Core.Interfaces.Services
{
    public interface ICourseService
    {
        Task<ApiResponse<List<CourseDto>>> GetAllCourseAsync(QueryParameters query);
        Task<ApiResponse<CourseDto>> GetCourseByIdAsync(Guid courseId);

        Task<ApiResponse<CourseDto>> UpdateCourseAsync(UpdateCourseDto updateCourseDto);
        Task<ApiResponse<CourseDto>> CreateCourseAsync(CreateCourseDto createCourseDto);
        Task<ApiResponse<bool>> DeleteCourseAsync(Guid courseId);
    }
}