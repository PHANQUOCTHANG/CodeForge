using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CodeForge__BE.src.CodeForge.Api.DTOs.Request.Course;
using CodeForge__BE.src.CodeForge.Api.DTOs.Response;

namespace CodeForge__BE.src.CodeForge.Core.Interfaces.Services
{
    public interface ICourseService
    {
        Task<IEnumerable<CourseDto>> GetAllAsync();
        Task<CourseDto?> GetByIdAsync(Guid id);
        Task<CourseDto> CreateAsync(createCourseDto dto);
        Task<CourseDto?> UpdateAsync(Guid id, updateCourseDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}