using CodeForge.Api.DTOs;
using CodeForge.Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;

namespace CodeForge.Api.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class LessonsController : ControllerBase
    {
        private readonly ILessonService _lessonService;

        public LessonsController(ILessonService lessonService)
        {
            _lessonService = lessonService;
        }

        // ============================
        // GET ALL LESSONS (GET /api/lesson)
        // ============================
        [HttpGet]
        // ✅ Kiểu trả về mới: Task<ActionResult<ApiResponse<List<LessonDto>>>> 
        public async Task<IActionResult> GetAllLessonAsync()
        {
            var result = await _lessonService.GetAllLessonAsync();

            // Dữ liệu được bọc trong ApiResponse<T>
            return Ok(ApiResponse<List<LessonDto>>.Success(result, "Lessons retrieved successfully."));
        }

        // ============================
        // GET LESSON BY ID (GET /api/lesson/{lessonId})
        // ============================
        [HttpGet("{id:guid}")]
        // ✅ Kiểu trả về mới: Task<ActionResult<ApiResponse<LessonDto>>>
        public async Task<IActionResult> GetLessonByIdAsync([FromRoute] Guid lessonId)
        {
            // Nếu LessonService ném NotFoundException, Global Handler sẽ trả về 404
            var result = await _lessonService.GetLessonByIdAsync(lessonId);

            return Ok(ApiResponse<LessonDto>.Success(result, "Lesson retrieved successfully."));
        }

        // ============================
        // UPDATE LESSON (PATCH /api/lesson/update)
        // ============================
        [Authorize]
        [HttpPatch("update")]
        // ✅ Kiểu trả về mới: Task<ActionResult<ApiResponse<LessonDto>>>
        public async Task<IActionResult> UpdateLessonAsync([FromBody] UpdateLessonDto updateLessonDto)
        {
            // Service sẽ ném NotFoundException hoặc ConflictException nếu cần
            var result = await _lessonService.UpdateLessonAsync(updateLessonDto);

            // Thao tác cập nhật thường trả về 200 OK
            return Ok(ApiResponse<LessonDto>.Success(result, "Lesson updated successfully."));
        }

        // ============================
        // CREATE LESSON (POST /api/lesson/create)
        // ============================
        [Authorize]
        [HttpPost("create")]
        // ✅ Kiểu trả về mới: Task<ActionResult<ApiResponse<LessonDto>>>
        public async Task<IActionResult> CreateLessonAsync([FromBody] CreateLessonDto createLessonDto)
        {
            // Service sẽ ném ConflictException nếu cần
            var result = await _lessonService.CreateLessonAsync(createLessonDto);

            // ✅ Chuẩn RESTful: Dùng CreatedAtAction để trả về 201 Created
            return CreatedAtAction(
                nameof(GetLessonByIdAsync),
                new { lessonId = result.LessonId },
                ApiResponse<LessonDto>.Created(result, "Lesson created successfully.")
            );
        }

        // ============================
        // DELETE LESSON (DELETE /api/lesson/delete/{lessonId})
        // ============================
        [Authorize]
        [HttpDelete("{id:guid}")] // ✅ Đã sửa endpoint cho phù hợp với /api/lesson/{lessonId}
        public async Task<IActionResult> DeleteLessonAsync([FromRoute] Guid lessonId)
        {
            // Service sẽ ném NotFoundException nếu không tìm thấy
            await _lessonService.DeleteLessonAsync(lessonId);

            // ✅ Chuẩn RESTful: Dùng NoContent để trả về 204 No Content
            return NoContent();
        }
    }
}