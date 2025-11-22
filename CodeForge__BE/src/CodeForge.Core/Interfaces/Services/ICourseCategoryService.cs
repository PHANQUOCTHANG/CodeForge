// Interface ICourseCategoryService.cs


using CodeForge.Api.DTOs.Request.CourseCategory;
using CodeForge.Api.DTOs.Response;

namespace CodeForge.Core.Interfaces.Services
{
    public interface ICourseCategoryService
    {
        Task<List<CategoryDto>> GetAllCategoriesAsync();
        Task<CategoryDto> GetCategoryByIdAsync(Guid id);
        Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto dto);
        Task<CategoryDto> UpdateCategoryAsync(UpdateCategoryDto dto);
        Task<bool> DeleteCategoryAsync(Guid id);
    }
}