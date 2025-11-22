using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using CodeForge.Core.Services; // Cần tạo IProgressService
using CodeForge.Api.DTOs.Response;
using CodeForge.Api.DTOs;


namespace CodeForge.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // 🛡️ Yêu cầu xác thực cho tất cả các API liên quan đến tiến độ
    public class ProgressController : BaseApiController
    {
        private readonly IProgressService _progressService;

        public ProgressController(IProgressService progressService)
        {
            _progressService = progressService;
        }

        /// <summary>
        /// Cập nhật trạng thái của một bài học (ví dụ: "completed" hoặc "in_progress").
        /// Endpoint này sẽ tạo mới hoặc cập nhật (UPSERT) một bản ghi trong bảng Progress.
        /// </summary>
        [HttpPost("update")]
        public async Task<IActionResult> UpdateLessonProgress([FromBody] UpdateProgressRequestDto request)
        {
            var userId = GetRequiredUserId();


            // Validate trạng thái đầu vào
            if (request.Status != "completed" && request.Status != "in_progress")
            {
                return BadRequest(ApiResponse<string>.Fail("Trạng thái không hợp lệ. Chỉ chấp nhận 'completed' hoặc 'in_progress'."));
            }

            // Service sẽ ném NotFoundException nếu LessonId không tồn tại 
            // hoặc ConflictException nếu người dùng chưa đăng ký khóa học
            var progressDto = await _progressService.UpdateProgressAsync(userId, request.LessonId, request.Status);

            return Ok(ApiResponse<ProgressDto>.Success(progressDto, "Cập nhật tiến độ thành công."));
        }

        /// <summary>
        /// Lấy chi tiết tiến độ (danh sách bài học đã hoàn thành) cho một khóa học cụ thể.
        /// </summary>
        /// <param name="courseId">ID của khóa học</param>
        [HttpGet("course/{courseId:guid}")]
        public async Task<IActionResult> GetProgressForCourse(Guid courseId)
        {
            var userId = GetRequiredUserId();


            var progressList = await _progressService.GetProgressForCourseAsync(userId, courseId);
            return Ok(ApiResponse<List<ProgressDto>>.Success(progressList, "Lấy chi tiết tiến độ thành công."));
        }

        /// <summary>
        /// Lấy tóm tắt tiến độ (% hoàn thành) cho tất cả các khóa học người dùng đã đăng ký.
        /// (Đây là logic từ GetUserCourseProgressAsync cũ).
        /// </summary>
        [HttpGet("my-summary")]
        public async Task<IActionResult> GetMyProgressSummary()
        {
            var userId = GetRequiredUserId();


            // Service sẽ chạy truy vấn JOIN phức tạp để tính toán %
            var summary = await _progressService.GetUserProgressSummaryAsync(userId);

            // Trả về Dictionary<Guid, double> (CourseId -> Percentage)
            return Ok(ApiResponse<Dictionary<Guid, double>>.Success(summary, "Lấy tóm tắt tiến độ thành công."));
        }


    }
}