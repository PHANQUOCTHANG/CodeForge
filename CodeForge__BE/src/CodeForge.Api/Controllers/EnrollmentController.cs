using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using CodeForge.Core.Interfaces.Services;
using CodeForge.Api.DTOs.Response; // ApiResponse
using System;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using CodeForge.Api.DTOs;
using CodeForge.Core.Exceptions;
using CodeForge.Api.DTOs.Request.Enrollment; // For Required attribute

namespace CodeForge.Api.Controllers
{
    // DTO for the request body of the enroll endpoint



    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class EnrollmentsController : BaseApiController
    {
        private readonly IEnrollmentService _enrollmentService;
        private readonly ILogger<EnrollmentsController> _logger; // Add Logger

        public EnrollmentsController(IEnrollmentService enrollmentService, ILogger<EnrollmentsController> logger)
        {
            _enrollmentService = enrollmentService;
            _logger = logger;
        }

        /// <summary>
        /// Bắt đầu quá trình đăng ký (nếu free) hoặc khởi tạo thanh toán (nếu paid).
        /// </summary>
        [HttpPost("enroll")]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)] // For payment init
        [ProducesResponseType(typeof(ApiResponse<EnrollmentDto>), StatusCodes.Status201Created)] // For free enrollment
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status409Conflict)]
        public async Task<IActionResult> EnrollOrInitiatePayment([FromBody] EnrollmentRequestDto request)
        {
            _logger.LogInformation("Enrollment request received for CourseId: {CourseId}", request.CourseId);
            var userId = GetUserId();
            if (userId == null)
            {
                _logger.LogWarning("Enrollment request failed: Unauthorized access attempt.");
                return Unauthorized();
            }


            try
            {
                // Pass HttpContext directly to the service
                var result = await _enrollmentService.ProcessEnrollmentRequestAsync(userId.Value, request.CourseId, HttpContext);

                if (result.IsPaymentRequired)
                {
                    _logger.LogInformation("Payment required for User {UserId}, Course {CourseId}. Returning payment info.", userId, request.CourseId);
                    // Return PaymentInfo (contains paymentUrl) with 200 OK
                    return Ok(ApiResponse<object>.Success(result.PaymentInfo!, "Khởi tạo thanh toán VNPay thành công. Vui lòng chuyển hướng người dùng."));
                }
                else
                {
                    _logger.LogInformation("Free enrollment successful for User {UserId}, Course {CourseId}.", userId, request.CourseId);
                    // Return EnrollmentDto with 201 Created
                    return CreatedAtAction(
                        nameof(GetEnrollmentStatus), // Points to the status check endpoint
                        new { courseId = result.EnrollmentInfo!.CourseId },
                        ApiResponse<EnrollmentDto>.Created(result.EnrollmentInfo, "Đăng ký khóa học miễn phí thành công.")
                    );
                }
            }
            catch (NotFoundException ex)
            {
                _logger.LogWarning(ex, "Enrollment request failed (NotFound): {ErrorMessage}", ex.Message);
                return NotFound(ApiResponse<string>.Fail(ex.Message));
            }
            catch (ConflictException ex)
            {
                _logger.LogWarning(ex, "Enrollment request failed (Conflict): {ErrorMessage}", ex.Message);
                return Conflict(ApiResponse<string>.Fail(ex.Message));
            }
            catch (Exception ex) // Catch unexpected errors
            {
                _logger.LogError(ex, "Unexpected error during enrollment process for User {UserId}, Course {CourseId}.", userId, request.CourseId);
                // Don't expose internal error details to the client in production
                return StatusCode(StatusCodes.Status500InternalServerError, ApiResponse<string>.Fail("Đã có lỗi xảy ra trong quá trình xử lý. Vui lòng thử lại."));
            }
        }

        /// <summary>
        /// Kiểm tra trạng thái đăng ký của user cho một khóa học.
        /// </summary>
        [HttpGet("status/{courseId:guid}")]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetEnrollmentStatus(Guid courseId)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            try
            {
                var isEnrolled = await _enrollmentService.IsUserEnrolledAsync(userId.Value, courseId);
                return Ok(ApiResponse<object>.Success(new { isEnrolled }, "Trạng thái đăng ký."));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking enrollment status for User {UserId}, Course {CourseId}.", userId, courseId);
                return StatusCode(StatusCodes.Status500InternalServerError, ApiResponse<string>.Fail("Lỗi kiểm tra trạng thái đăng ký."));
            }
        }

        // --- Other Endpoints (GetMyEnrollments, Unenroll - Implement as needed) ---

        // Example GetMyEnrollments
        [HttpGet("my-enrollments")]
        [ProducesResponseType(typeof(ApiResponse<List<EnrollmentDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetMyEnrollments()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            try
            {
                var enrollments = await _enrollmentService.GetEnrollmentsByUserIdAsync(userId.Value);
                return Ok(ApiResponse<List<EnrollmentDto>>.Success(enrollments, "Lấy danh sách khóa học đã đăng ký thành công."));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching enrollments for User {UserId}.", userId);
                return StatusCode(StatusCodes.Status500InternalServerError, ApiResponse<string>.Fail("Lỗi lấy danh sách khóa học đã đăng ký."));
            }
        }


        // --- Helper to get UserId ---

    }
}