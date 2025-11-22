using CodeForge.Api.Controllers; // BaseApiController
using CodeForge.Api.DTOs; // ApiResponse
using CodeForge.Api.DTOs.Request.CourseCategory;
using CodeForge.Api.DTOs.Response;
using CodeForge.Core.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace CodeForge.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Route: api/coursecategory
    public class CourseCategoryController : BaseApiController
    {
        private readonly ICourseCategoryService _categoryService;

        public CourseCategoryController(ICourseCategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        // --- GET ALL (Public) ---
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _categoryService.GetAllCategoriesAsync();
            return Ok(ApiResponse<List<CategoryDto>>.Success(result));
        }

        // --- GET BY ID (Public) ---
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById([FromRoute] Guid id)
        {
            var result = await _categoryService.GetCategoryByIdAsync(id);
            // Service ném NotFoundException (404) nếu không tìm thấy
            return Ok(ApiResponse<CategoryDto>.Success(result));
        }

        // --- CREATE (Admin Only) ---
        [Authorize(Roles = "admin")] // 🔒 Chỉ Admin mới được tạo
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
        {
            var result = await _categoryService.CreateCategoryAsync(dto);
            // Service ném ConflictException (409) nếu trùng tên

            return CreatedAtAction(
                nameof(GetById),
                new { id = result.CategoryId },
                ApiResponse<CategoryDto>.Created(result)
            );
        }

        // --- UPDATE (Admin Only) ---
        [Authorize(Roles = "admin")] // 🔒 Chỉ Admin mới được cập nhật
        [HttpPut("{id:guid}")] // Hoặc HttpPatch
        public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateCategoryDto dto)
        {
            dto.CategoryId = id;
            var result = await _categoryService.UpdateCategoryAsync(dto);
            // Service ném NotFoundException (404) hoặc ConflictException (409)

            return Ok(ApiResponse<CategoryDto>.Success(result, "Category updated successfully."));
        }

        // --- DELETE (Admin Only) ---
        [Authorize(Roles = "admin")] // 🔒 Chỉ Admin mới được xóa
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
        {
            await _categoryService.DeleteCategoryAsync(id);
            // Service ném NotFoundException (404) nếu không tìm thấy

            return NoContent(); // HTTP 204
        }
    }
}