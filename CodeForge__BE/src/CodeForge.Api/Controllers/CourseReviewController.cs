using CodeForge.Api.DTOs;
using CodeForge.Core.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using CodeForge.Api.DTOs.Response;
using CodeForge.Api.DTOs.Request.Enrollment;

namespace CodeForge.Api.Controllers
{
    // Kế thừa BaseApiController để sử dụng GetRequiredUserId()
    [ApiController]
    // Route chuẩn RESTful: /api/courses/{courseId}/reviews
    [Route("api/courses/{courseId:guid}/reviews")]
    public class CourseReviewController : BaseApiController
    {
        private readonly ICourseReviewService _reviewService;

        public CourseReviewController(ICourseReviewService reviewService)
        {
            _reviewService = reviewService;
        }


        // --- GET ALL REVIEWS (GET /api/courses/{courseId}/reviews) ---
        // ✅ Endpoint công khai (Dùng để hiển thị đánh giá)
        [HttpGet]
        public async Task<IActionResult> GetReviewsByCourseId([FromRoute] Guid courseId)
        {
            var result = await _reviewService.GetReviewsByCourseIdAsync(courseId);
            return Ok(ApiResponse<List<CourseReviewDto>>.Success(result, "Reviews retrieved successfully."));
        }

        // --- CREATE REVIEW (POST /api/courses/{courseId}/reviews) ---
        [Authorize] // 🛡️ Bắt buộc đăng nhập
        [HttpPost]
        public async Task<IActionResult> CreateReview([FromRoute] Guid courseId, [FromBody] CreateReviewDto dto)
        {
            // Lấy User ID bắt buộc từ BaseApiController (sẽ ném 403 nếu token thiếu ID)
            var userId = GetRequiredUserId();
            dto.CourseId = courseId; // Gán CourseId từ Route vào DTO

            var result = await _reviewService.CreateReviewAsync(userId, dto);

            // ✅ RESTful 201 Created: Trả về location của tài nguyên mới
            return CreatedAtAction(
                nameof(GetReviewsByCourseId), // Lấy endpoint GET ALL để chỉ định vị trí
                new { courseId = courseId }, // Giá trị Route (courseId)
                ApiResponse<CourseReviewDto>.Created(result, "Review created successfully.")
            );
        }

        // --- UPDATE REVIEW (PATCH /api/courses/{courseId}/reviews/{reviewId}) ---
        [Authorize] // 🛡️ Bắt buộc đăng nhập
        [HttpPatch("{reviewId:guid}")] // ✅ Thao tác PATCH/PUT nên có ID tài nguyên trong URL
        public async Task<IActionResult> UpdateReview(
            [FromRoute] Guid reviewId,
            [FromBody] UpdateReviewDto dto)
        {
            var userId = GetRequiredUserId();
            dto.ReviewId = reviewId; // Gán ID từ Route vào DTO

            // Service kiểm tra quyền sở hữu, cập nhật, và ném lỗi 404/403
            var result = await _reviewService.UpdateReviewAsync(userId, reviewId, dto);

            // ✅ Trả về 200 OK (Standard for update)
            return Ok(ApiResponse<CourseReviewDto>.Success(result, "Review updated successfully."));
        }


        // --- DELETE REVIEW (DELETE /api/courses/{courseId}/reviews/{reviewId}) ---
        [Authorize] // 🛡️ Bắt buộc đăng nhập
        [HttpDelete("{reviewId:guid}")]
        public async Task<IActionResult> DeleteReview([FromRoute] Guid reviewId)
        {
            var userId = GetRequiredUserId();

            // Service kiểm tra quyền sở hữu và xóa
            await _reviewService.DeleteReviewAsync(userId, reviewId);

            // ✅ RESTful 204: Trả về No Content
            return NoContent();
        }
    }
}