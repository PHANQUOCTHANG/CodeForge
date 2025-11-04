using CodeForge.Core.Entities;
using System;
using System.Threading.Tasks;

namespace CodeForge.Core.Interfaces.Repositories
{
    /// <summary>
    /// Interface định nghĩa các thao tác truy cập dữ liệu cho bảng Payments.
    /// </summary>
    public interface IPaymentRepository
    {
        /// <summary>
        /// Thêm mới một bản ghi thanh toán.
        /// </summary>
        Task<Payment> AddAsync(Payment payment);

        /// <summary>
        /// Cập nhật thông tin một bản ghi thanh toán đã tồn tại.
        /// </summary>
        Task<Payment> UpdateAsync(Payment payment);

        /// <summary>
        /// Lấy thông tin thanh toán dựa trên PaymentId (PK).
        /// </summary>
        Task<Payment?> GetByIdAsync(Guid paymentId);
        /// <summary>
        /// Lấy một thanh toán đang chờ (Pending) của user cho 1 khóa học
        /// (Dùng để sửa lỗi nhấn đúp)
        /// </summary>
        Task<Payment?> GetPendingPaymentByCourseAsync(Guid userId, Guid courseId);
        /// <summary>
        /// Lấy thông tin thanh toán dựa trên OrderId (mã đơn hàng gửi cho cổng TT).
        /// Quan trọng cho việc xử lý IPN/Webhook.
        /// </summary>
        Task<Payment?> GetByOrderIdAsync(string orderId);
    }
}