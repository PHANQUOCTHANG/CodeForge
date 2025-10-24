using CodeForge.Api.DTOs;
using CodeForge.Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using CodeForge.Core.Interfaces.Repositories;
using Microsoft.AspNetCore.Authorization; // Giả định Module DTOs nằm ở đây

namespace CodeForge.Api.Controllers
{
    // ✅ Đổi tên class sang PascalCase (ModuleController) theo chuẩn C#
    [ApiController]
    [Route("api/[Controller]")]
    public class ModulesController : ControllerBase
    {
        private readonly IModuleService _moduleService;

        public ModulesController(IModuleService moduleService)
        {
            _moduleService = moduleService;
        }

        // ============================
        // GET ALL MODULES (GET /api/module)
        // ============================
        [HttpGet]
        public async Task<IActionResult> GetAllModuleAsync()
        {
            // Service trả về List<ModuleDto>
            var result = await _moduleService.GetAllModuleAsync();

            // ✅ Bọc dữ liệu và trả về 200 OK
            return Ok(ApiResponse<List<ModuleDto>>.Success(result, "Modules retrieved successfully."));
        }

        // ============================
        // GET MODULE BY ID (GET /api/module/{moduleId})
        // ============================
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetModuleByIdAsync([FromRoute] Guid moduleId)
        {
            // Service sẽ ném NotFoundException nếu không tìm thấy
            var result = await _moduleService.GetModuleByIdAsync(moduleId);

            // ✅ Bọc dữ liệu và trả về 200 OK
            return Ok(ApiResponse<ModuleDto>.Success(result, "Module retrieved successfully."));
        }

        // ============================
        // UPDATE MODULE (PATCH /api/module/update)
        // ============================
        [Authorize]
        [HttpPatch("update")]
        public async Task<IActionResult> UpdateModuleAsync([FromBody] UpdateModuleDto updateModuleDto)
        {
            // Service sẽ ném NotFoundException hoặc ConflictException
            var result = await _moduleService.UpdateModuleAsync(updateModuleDto);

            // ✅ Thao tác cập nhật trả về 200 OK
            return Ok(ApiResponse<ModuleDto>.Success(result, "Module updated successfully."));
        }

        // ============================
        // CREATE MODULE (POST /api/module/create)
        // ============================
        [Authorize]
        [HttpPost("create")]
        public async Task<IActionResult> CreateModuleAsync([FromBody] CreateModuleDto createModuleDto)
        {
            // Service sẽ ném ConflictException nếu tên bị trùng
            var result = await _moduleService.CreateModuleAsync(createModuleDto);

            // ✅ Chuẩn RESTful: Dùng CreatedAtAction để trả về 201 Created
            return CreatedAtAction(
                nameof(GetModuleByIdAsync),
                new { moduleId = result.ModuleId }, // Giả định ModuleDto có thuộc tính Id
                ApiResponse<ModuleDto>.Created(result, "Module created successfully.")
            );
        }

        // ============================
        // DELETE MODULE (DELETE /api/module/{moduleId})
        // ============================
        [Authorize]
        [HttpDelete("{id:guid}")] // ✅ Đã sửa endpoint cho phù hợp với /api/module/{moduleId}
        public async Task<IActionResult> DeleteModuleAsync([FromRoute] Guid moduleId)
        {
            // Service sẽ ném NotFoundException nếu không tìm thấy
            await _moduleService.DeleteModuleAsync(moduleId);

            // ✅ Chuẩn RESTful: Dùng NoContent để trả về 204 No Content
            return NoContent();
        }
    }
}