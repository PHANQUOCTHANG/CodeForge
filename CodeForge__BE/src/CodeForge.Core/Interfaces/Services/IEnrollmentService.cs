using CodeForge.Api.Controllers;
using CodeForge.Api.DTOs;
using CodeForge.Api.DTOs.Response;


namespace CodeForge.Core.Interfaces.Services
{
    public interface IEnrollmentService
    {
        Task<EnrollmentDto> CreateEnrollmentAsync(Guid userId, Guid courseId); // Có thể giữ lại nếu cần tạo trực tiếp
        Task<List<EnrollmentDto>> GetEnrollmentsByUserIdAsync(Guid userId);
        Task<bool> DeleteEnrollmentAsync(Guid userId, Guid courseId);
        Task<bool> IsUserEnrolledAsync(Guid userId, Guid courseId);
        /// <summary>
        /// Xử lý yêu cầu đăng ký: Kiểm tra giá, tạo Enrollment (nếu free)
        /// hoặc khởi tạo thanh toán VNPay (nếu paid).
        /// </summary>
        /// <returns>Kết quả chứa thông tin Enrollment hoặc thông tin thanh toán.</returns>
        Task<EnrollmentProcessResult> ProcessEnrollmentRequestAsync(Guid userId, Guid courseId, HttpContext httpContext);

    }
}