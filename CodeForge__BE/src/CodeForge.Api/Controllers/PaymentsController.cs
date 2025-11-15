using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using CodeForge.Core.Interfaces.Repositories; // Namespace của IPaymentRepository
using Microsoft.AspNetCore.Authorization;  // Cần cho [Authorize]
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using System;
using CodeForge.Api.DTOs.Response;
using CodeForge.Api.DTOs; // Namespace của ApiResponse<T>

namespace CodeForge.Api.Controllers
{
    // Kế thừa từ BaseApiController
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : BaseApiController
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly ILogger<PaymentsController> _logger;

        public PaymentsController(
            IPaymentRepository paymentRepository,
            ILogger<PaymentsController> logger)
        {
            _paymentRepository = paymentRepository;
            _logger = logger;
        }

        /// <summary>
        /// [Dùng cho Frontend Polling]
        /// Kiểm tra trạng thái của một thanh toán bằng OrderId (vnp_TxnRef).
        /// Chỉ người tạo thanh toán mới có quyền xem.
        /// </summary>
        /// <param name="orderId">Mã OrderId (vnp_TxnRef) của thanh toán</param>
        /// <returns>Trạng thái thanh toán (Pending, Succeeded, Failed)</returns>
        [HttpGet("status/{orderId}")]
        [Authorize] // 👈 BẮT BUỘC: Phải đăng nhập mới được check
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetPaymentStatus(string orderId)
        {
            // 1. Lấy UserId từ token (nhờ kế thừa BaseApiController)
            var userId = GetUserId();
            if (userId == null)
            {
                // Điều này hiếm khi xảy ra nếu có [Authorize], nhưng vẫn check
                return Unauthorized(ApiResponse<string>.Fail("Token không hợp lệ."));
            }

            // 2. Tìm thanh toán bằng OrderId
            var payment = await _paymentRepository.GetByOrderIdAsync(orderId);

            // 3. Xử lý không tìm thấy
            if (payment == null)
            {
                _logger.LogWarning("GetPaymentStatus: Không tìm thấy thanh toán với OrderId {OrderId}", orderId);
                return NotFound(ApiResponse<string>.Fail("Không tìm thấy giao dịch."));
            }

            // 4. KIỂM TRA BẢO MẬT QUAN TRỌNG NHẤT
            // Đảm bảo người dùng A không thể xem đơn hàng của người dùng B
            if (payment.UserId != userId.Value)
            {
                _logger.LogWarning("GetPaymentStatus (FORBIDDEN): User {UserId} cố gắng xem thanh toán {OrderId} của User {PaymentUserId}.",
                    userId, orderId, payment.UserId);
                return Forbid(); // Trả về 403 Forbidden
            }

            // 5. THÀNH CÔNG: Trả về trạng thái
            _logger.LogInformation("GetPaymentStatus: Trả về trạng thái {Status} cho OrderId {OrderId}", payment.Status, orderId);

            // ✅ Trả về chính xác cấu trúc mà frontend đang mong đợi
            // { data: { status: "Pending" } }
            return Ok(ApiResponse<object>.Success(
                new { status = payment.Status },
                "Lấy trạng thái thanh toán thành công."
            ));
        }
    }
}