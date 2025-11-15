using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using CodeForge.Core.Services;
using CodeForge.Application.DTOs.Lessons;
using CodeForge.Api.DTOs.Response;
using CodeForge.Api.DTOs;
using CodeForge.Application.DTOs.Response;

namespace CodeForge.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
<<<<<<< HEAD
    // [Authorize] 
=======
    [Authorize] // 🛡️ Yêu cầu xác thực
>>>>>>> 4267c93ffa34cc360cdb6298ed97d499bdd02553
    public class LessonsController : BaseApiController
    {
        private readonly ILessonService _lessonService;

        public LessonsController(ILessonService lessonService)
        {
            _lessonService = lessonService;
        }

<<<<<<< HEAD
        // [HttpGet] 
        // public async Task<IActionResult> GetAllLesson () {
        //     var lessons = await _lessonService.

        //     return Ok(ApiResponse<List<LessonDto>>.Success(lessons, "Lấy bài học thành công."));
        // }

=======
>>>>>>> 4267c93ffa34cc360cdb6298ed97d499bdd02553
        /// <summary>
        /// Lấy chi tiết một bài học (Người dùng phải đăng ký khóa học).
        /// </summary>
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetLessonById(Guid id)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            // Service sẽ ném NotFoundException hoặc ForbiddenException
            var lesson = await _lessonService.GetLessonDetailAsync(id, userId.Value);
            return Ok(ApiResponse<LessonDto>.Success(lesson, "Lấy chi tiết bài học thành công."));
        }

        /// <summary>
        /// Lấy danh sách các bài học (tóm tắt) thuộc một Module.
        /// </summary>
        [HttpGet("module/{moduleId:guid}")]
        public async Task<IActionResult> GetLessonsByModule(Guid moduleId)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var lessons = await _lessonService.GetLessonsByModuleAsync(moduleId, userId.Value);
            return Ok(ApiResponse<List<LessonDto>>.Success(lessons, "Lấy danh sách bài học thành công."));
        }

        /// <summary>
        /// Tạo một bài học mới (Yêu cầu quyền Teacher/Admin).
        /// </summary>
        [HttpPost("create")]
        // [Authorize(Roles = "Teacher, Admin")] // 🛡️ Thêm phân quyền
        public async Task<IActionResult> CreateLesson([FromBody] CreateLessonDto createDto)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var newLesson = await _lessonService.CreateLessonAsync(createDto, userId.Value);

            // ✅ RESTful: Trả về 201 Created
            return CreatedAtAction(
                nameof(GetLessonById),
                new { id = newLesson.LessonId },
                ApiResponse<LessonDto>.Created(newLesson, "Tạo bài học thành công.")
            );
        }


    }
}