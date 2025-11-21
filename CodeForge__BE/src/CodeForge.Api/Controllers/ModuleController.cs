using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using CodeForge.Core.Services;
using CodeForge.Application.DTOs.Modules;
using CodeForge.Api.DTOs.Response;
using CodeForge.Api.DTOs;

namespace CodeForge.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // 🛡️ Yêu cầu xác thực cho tất cả
    public class ModulesController : BaseApiController
    {
        private readonly IModuleService _moduleService;

        public ModulesController(IModuleService moduleService)
        {
            _moduleService = moduleService;
        }

        /// <summary>
        /// Lấy chi tiết một chương học (bao gồm các bài học).
        /// (Yêu cầu đã đăng ký khóa học).
        /// </summary>
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var userId = GetRequiredUserId();


            var module = await _moduleService.GetByIdAsync(id, userId);
            return Ok(ApiResponse<ModuleDto>.Success(module, "Lấy chi tiết chương học thành công."));
        }

        /// <summary>
        /// Lấy tất cả chương học (và bài học) của một khóa học.
        /// (Yêu cầu đã đăng ký khóa học).
        /// </summary>
        [HttpGet("course/{courseId:guid}")]
        public async Task<IActionResult> GetByCourseId(Guid courseId)
        {
            var userId = GetRequiredUserId();


            var modules = await _moduleService.GetByCourseIdAsync(courseId, userId);
            return Ok(ApiResponse<List<ModuleDto>>.Success(modules, "Lấy danh sách chương học thành công."));
        }

        /// <summary>
        /// Tạo một chương học mới.
        /// (Yêu cầu quyền sở hữu khóa học / Teacher / Admin).
        /// </summary>
        [HttpPost("create")]
        // [Authorize(Roles = "Teacher, Admin")] // 🛡️ Thêm phân quyền
        public async Task<IActionResult> Create([FromBody] CreateModuleDto dto)
        {
            var userId = GetRequiredUserId();


            var newModule = await _moduleService.CreateAsync(dto, userId);

            return CreatedAtAction(
                nameof(GetById),
                new { id = newModule.ModuleId },
                ApiResponse<ModuleDto>.Created(newModule, "Tạo chương học thành công.")
            );
        }

        /// <summary>
        /// Cập nhật thông tin một chương học.
        /// (Yêu cầu quyền sở hữu khóa học / Teacher / Admin).
        /// </summary>
        [HttpPut("update")] // Dùng PUT hoặc PATCH
        // [Authorize(Roles = "Teacher, Admin")] // 🛡️ Thêm phân quyền
        public async Task<IActionResult> Update([FromBody] UpdateModuleDto dto)
        {
            var userId = GetRequiredUserId();

            var updatedModule = await _moduleService.UpdateAsync(dto, userId);
            return Ok(ApiResponse<ModuleDto>.Success(updatedModule, "Cập nhật chương học thành công."));
        }

        /// <summary>
        /// Xóa một chương học.
        /// (Yêu cầu quyền sở hữu khóa học / Teacher / Admin).
        /// </summary>
        [HttpDelete("{id:guid}")]
        // [Authorize(Roles = "Teacher, Admin")] // 🛡️ Thêm phân quyền
        public async Task<IActionResult> Delete(Guid id)
        {
            var userId = GetRequiredUserId();


            await _moduleService.DeleteAsync(id, userId);
            return NoContent(); // 204 No Content là chuẩn cho Delete
        }


    }
}