using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using CodeForge.Core.Interfaces.Services;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic; // 👈 Đảm bảo bạn đã import IQueryCollection

namespace CodeForge.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WebhookController : BaseApiController // Giả sử bạn kế thừa từ BaseApiController
    {
        private readonly IPaymentService _paymentService;
        private readonly ILogger<WebhookController> _logger;

        public WebhookController(IPaymentService paymentService, ILogger<WebhookController> logger)
        {
            _paymentService = paymentService;
            _logger = logger;
        }

        /// <summary>
        /// Endpoint nhận Instant Payment Notification (IPN) từ VNPay.
        /// </summary>
        [HttpGet("vnpay-ipn")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK, "text/plain")]
        [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest, "text/plain")]

        // ✅ SỬA LỖI: Xóa tham số [FromQuery] IQueryCollection vnpayData
        public async Task<IActionResult> VNPayIPN()
        {
            // ✅ SỬA LỖI: Lấy IQueryCollection trực tiếp từ HttpContext
            IQueryCollection vnpayData = HttpContext.Request.Query;

            _logger.LogInformation("----------------------------------------------------------------------Received VNPay IPN request.");

            // Check này bây giờ sẽ hoạt động đúng
            if (vnpayData == null || vnpayData.Count == 0)
            {
                _logger.LogWarning("VNPay IPN request received with no data.");
                return Content("RspCode=99&Message=Input data required", "text/plain");
            }

            try
            {
                _logger.LogInformation("---------------Xử lý VNP");

                // Truyền vnpayData vào service như bình thường
                var response = await _paymentService.HandleVNPayIPNAsync(vnpayData);

                _logger.LogInformation("Responding to VNPay IPN with RspCode={RspCode}, Message={Message}", response.RspCode, response.Message);
                return Content($"RspCode={response.RspCode}&Message={response.Message}", "text/plain");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Critical error processing VNPay IPN.");
                return Content("RspCode=99&Message=Internal Server Error", "text/plain");
            }
        }
    }
}
