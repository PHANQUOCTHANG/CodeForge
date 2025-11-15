
using CodeForge.Api.Controllers;
using CodeForge.Api.DTOs.Response;

namespace CodeForge.Application.DTOs
{
    /// <summary>
    /// DTO trả về kết quả sau khi xử lý yêu cầu đăng ký/mua khóa học.
    /// </summary>
    public class EnrollmentProcessResult
    {
        /// <summary>
        /// True nếu khóa học yêu cầu thanh toán, False nếu là khóa học miễn phí.
        /// </summary>
        public bool IsPaymentRequired { get; set; }

        /// <summary>
        /// Chứa thông tin cần thiết cho cổng thanh toán nếu IsPaymentRequired=true.
        /// Ví dụ: { "paymentUrl": "https://..." } cho VNPay
        /// </summary>
        public object? PaymentInfo { get; set; }

        /// <summary>
        /// Chứa thông tin đăng ký nếu IsPaymentRequired=false (khóa học miễn phí).
        /// </summary>
        public EnrollmentDto? EnrollmentInfo { get; set; }
    }
}