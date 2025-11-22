using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using CodeForge.Core.Services;

using CodeForge.Api.DTOs.Response;
using CodeForge.Api.DTOs;
using CodeForge.Api.DTOs.Lessons;


namespace CodeForge.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // 🛡️ Yêu cầu xác thực
    public class LessonsController : BaseApiController
    {
        private readonly ILessonService _lessonService;

        public LessonsController(ILessonService lessonService)
        {
            _lessonService = lessonService;
        }

        /// <summary>
        /// Lấy chi tiết một bài học (Người dùng phải đăng ký khóa học).
        /// </summary>
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetLessonById(Guid id)
        {
            var userId = GetRequiredUserId();

            // Service sẽ ném NotFoundException hoặc ForbiddenException
            var lesson = await _lessonService.GetLessonDetailAsync(id, userId);
            return Ok(ApiResponse<LessonDto>.Success(lesson, "Lấy chi tiết bài học thành công."));
        }

        /// <summary>
        /// Lấy danh sách các bài học (tóm tắt) thuộc một Module.
        /// </summary>
        [HttpGet("module/{moduleId:guid}")]
        public async Task<IActionResult> GetLessonsByModule(Guid moduleId)
        {
            var userId = GetRequiredUserId();
            var lessons = await _lessonService.GetLessonsByModuleAsync(moduleId, userId);
            return Ok(ApiResponse<List<LessonDto>>.Success(lessons, "Lấy danh sách bài học thành công."));
        }

        /// <summary>
        /// Tạo một bài học mới (Yêu cầu quyền Teacher/Admin).
        /// </summary>
        [HttpPost("create")]
        [Authorize(Roles = "teacher, admin")] // 🛡️ Thêm phân quyền
        public async Task<IActionResult> CreateLesson([FromBody] CreateLessonDto createDto)
        {
            var userId = GetRequiredUserId();

            var newLesson = await _lessonService.CreateLessonAsync(createDto, userId);

            // ✅ RESTful: Trả về 201 Created
            return CreatedAtAction(
                nameof(GetLessonById),
                new { id = newLesson.LessonId },
                ApiResponse<LessonDto>.Created(newLesson, "Tạo bài học thành công.")
            );
        }


    }
}