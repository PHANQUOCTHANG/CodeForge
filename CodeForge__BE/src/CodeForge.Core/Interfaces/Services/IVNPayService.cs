using Microsoft.AspNetCore.Http;
using CodeForge.Core.Entities;

namespace CodeForge.Core.Interfaces.Services
{
    /// <summary>
    /// Interface cho các dịch vụ tương tác trực tiếp với VNPay API/Library.
    /// </summary>
    public interface IVNPayService
    {
        /// <summary>
        /// Tạo URL chuyển hướng người dùng đến cổng thanh toán VNPay.
        /// </summary>
        /// <param name="payment">Thông tin thanh toán đã lưu (Pending).</param>
        /// <param name="context">HttpContext để lấy địa chỉ IP.</param>
        /// <returns>URL thanh toán của VNPay.</returns>
        string CreatePaymentUrl(Payment payment, HttpContext context);

        /// <summary>
        /// Xác thực chữ ký trong dữ liệu IPN hoặc Return URL từ VNPay.
        /// </summary>
        /// <param name="vnpayData">Bộ sưu tập các tham số query từ VNPay.</param>
        /// <returns>True nếu chữ ký hợp lệ, False nếu không.</returns>
        bool ValidateSignature(IQueryCollection vnpayData);
    }
}