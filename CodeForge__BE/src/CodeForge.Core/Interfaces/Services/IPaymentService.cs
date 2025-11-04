using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;

namespace CodeForge.Core.Interfaces.Services
{
    /// <summary>
    /// DTO chứa kết quả trả về cho VNPay từ IPN handler.
    /// </summary>
    public class VNPayIPNResponse
    {
        /// <summary>
        /// Mã phản hồi theo tài liệu VNPay (ví dụ: "00", "01", "97").
        /// </summary>
        public string RspCode { get; set; } = "99"; // Default to error

        /// <summary>
        /// Thông điệp phản hồi theo tài liệu VNPay.
        /// </summary>
        public string Message { get; set; } = "Unknown Error";
    }

    /// <summary>
    /// Interface cho service xử lý logic thanh toán tổng quát,
    /// có thể bao gồm nhiều cổng thanh toán.
    /// </summary>
    public interface IPaymentService
    {
        /// <summary>
        /// Tạo yêu cầu thanh toán qua VNPay và trả về URL redirect.
        /// </summary>
        Task<string> CreateVNPayPaymentAsync(Guid userId, Guid courseId, decimal amount, HttpContext httpContext);

        /// <summary>
        /// Xử lý và xác thực thông báo IPN từ VNPay.
        /// Cập nhật trạng thái Payment và tạo Enrollment nếu thành công.
        /// </summary>
        Task<VNPayIPNResponse> HandleVNPayIPNAsync(IQueryCollection vnpayData);

        // Task<object> CreateStripePaymentIntentAsync(...); // Ví dụ nếu có Stripe
        // Task<bool> HandleStripeWebhookAsync(...);        // Ví dụ nếu có Stripe
    }
}