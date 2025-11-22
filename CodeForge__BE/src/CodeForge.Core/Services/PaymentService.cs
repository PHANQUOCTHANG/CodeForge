using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Core.Interfaces.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CodeForge.Application.DTOs; // Thêm DTO
using CodeForge.Core.Exceptions;
using ApplicationException = CodeForge.Core.Exceptions.ApplicationException; // Thêm ApplicationException

namespace CodeForge.Core.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IVNPayService _vnPayService;
        private readonly IPaymentRepository _paymentRepository;
        private readonly IEnrollmentRepository _enrollmentRepository;
        private readonly ICourseRepository _courseRepository;
        private readonly ILogger<PaymentService> _logger;

        public PaymentService(
          IVNPayService vnPayService,
          IPaymentRepository paymentRepository,
          IEnrollmentRepository enrollmentRepository, ICourseRepository courseRepository,
          ILogger<PaymentService> logger)
        {
            _vnPayService = vnPayService;
            _courseRepository = courseRepository;
            _paymentRepository = paymentRepository;
            _enrollmentRepository = enrollmentRepository;
            _logger = logger;
        }

        /// <summary>
        /// Lấy URL thanh toán VNPay.
        /// Sẽ TÌM một thanh toán 'pending' đã tồn tại,
        /// hoặc TẠO MỚI nếu chưa có. (ĐÃ SỬA LỖI NHẤN ĐÚP)
        /// </summary>
        public async Task<string> CreateVNPayPaymentAsync(Guid userId, Guid courseId, decimal amount, HttpContext httpContext)
        {
            if (amount <= 0)
            {
                throw new ArgumentException("Payment amount must be greater than zero.", nameof(amount));
            }

            // ✅ --- BẮT ĐẦU SỬA LỖI NHẤN ĐÚP ---
            // 1. Kiểm tra xem đã có thanh toán PENDING nào cho khóa học này chưa
            // (Giả định bạn đã thêm 'GetPendingPaymentByCourseAsync' vào IPaymentRepository)
            var existingPendingPayment = await _paymentRepository.GetPendingPaymentByCourseAsync(userId, courseId);

            Payment paymentToProcess; // Chúng ta sẽ dùng payment này để tạo URL

            if (existingPendingPayment != null)
            {
                // 2a. NẾU ĐÃ CÓ: Dùng lại thanh toán cũ
                _logger.LogWarning("Found existing pending payment (OrderId: {OrderId}) for User {UserId}, Course {CourseId}. Re-using it.",
                  existingPendingPayment.OrderId, userId, courseId);

                // Cập nhật lại số tiền (phòng trường hợp giá/khuyến mãi thay đổi)
                existingPendingPayment.Amount = amount;
                existingPendingPayment.CreatedAt = DateTime.UtcNow; // Cập nhật thời gian (để tính ExpireDate)
                await _paymentRepository.UpdateAsync(existingPendingPayment);

                paymentToProcess = existingPendingPayment;
            }
            else
            {
                // 2b. NẾU CHƯA CÓ: Tạo thanh toán mới
                _logger.LogInformation("No pending payment found. Creating new payment for User {UserId}, Course {CourseId}.", userId, courseId);
                var newPayment = new Payment
                {
                    PaymentId = Guid.NewGuid(),
                    UserId = userId,
                    CourseId = courseId,
                    Amount = amount,
                    Currency = "VND",
                    Status = "Pending",
                    PaymentGateway = "VNPay",
                    CreatedAt = DateTime.UtcNow,
                    OrderId = Guid.NewGuid().ToString("N") // Mã đơn hàng duy nhất
                };

                await _paymentRepository.AddAsync(newPayment);
                paymentToProcess = newPayment;

                _logger.LogInformation("Created Pending Payment record. PaymentId: {PaymentId}, OrderId: {OrderId}",
                  paymentToProcess.PaymentId, paymentToProcess.OrderId);
            }
            // ✅ --- KẾT THÚC SỬA LỖI NHẤN ĐÚP ---

            // 3. Generate VNPay URL (Từ payment đã có hoặc payment mới)
            try
            {
                // Dùng paymentToProcess thay vì 'payment'
                string paymentUrl = _vnPayService.CreatePaymentUrl(paymentToProcess, httpContext);

                // Kiểm tra null (đã có từ trước)
                if (string.IsNullOrEmpty(paymentUrl))
                {
                    _logger.LogError(
                      "CRITICAL: _vnPayService.CreatePaymentUrl returned null or empty for OrderId {OrderId}.",
                      paymentToProcess.OrderId);
                    throw new Exception("VNPay service failed to generate payment URL.");
                }

                _logger.LogInformation("Generated VNPay URL for Order {OrderId}", paymentToProcess.OrderId);
                return paymentUrl;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create VNPay payment URL for Order {OrderId}", paymentToProcess.OrderId);

                // Cập nhật trạng thái Payment thành "Failed"
                paymentToProcess.Status = "Failed";
                await _paymentRepository.UpdateAsync(paymentToProcess);

                // Ném lại lỗi để Middleware (hoặc Controller) bắt
                throw new Exception("Error initializing payment with VNPay.", ex);
            }
        }

        //
        // ‼️ HÀM NÀY ĐÃ CHÍNH XÁC - KHÔNG CẦN SỬA ‼️
        //
        public async Task<VNPayIPNResponse> HandleVNPayIPNAsync(IQueryCollection vnpayData)
        {
            // ... (Log raw query)
            _logger.LogInformation("Received VNPay IPN: ...");

            // 1. Validate Signature
            if (!_vnPayService.ValidateSignature(vnpayData))
            {
                _logger.LogError("VNPay IPN Error: Invalid Signature.");
                return new VNPayIPNResponse { RspCode = "97", Message = "Invalid Signature" };
            }

            // 2. Extract Data
            vnpayData.TryGetValue("vnp_TxnRef", out var vnp_TxnRef); // Your OrderId
            vnpayData.TryGetValue("vnp_ResponseCode", out var vnp_ResponseCode);
            vnpayData.TryGetValue("vnp_TransactionStatus", out var vnp_TransactionStatus);
            vnpayData.TryGetValue("vnp_TransactionNo", out var vnp_TransactionNo);
            vnpayData.TryGetValue("vnp_Amount", out var vnp_Amount);

            if (string.IsNullOrEmpty(vnp_TxnRef))
            {
                _logger.LogError("VNPay IPN Error: Missing vnp_TxnRef.");
                return new VNPayIPNResponse { RspCode = "01", Message = "Order not found" };
            }

            // 3. Find Payment record by OrderId
            var payment = await _paymentRepository.GetByOrderIdAsync(vnp_TxnRef.ToString());
            if (payment == null)
            {
                _logger.LogError("VNPay IPN Error: Payment record not found for OrderId {OrderId}", vnp_TxnRef);
                return new VNPayIPNResponse { RspCode = "01", Message = "Order not found" };
            }

            // 4. Check Amount
            decimal paymentAmountVND = (decimal.TryParse(vnp_Amount.ToString(), out var amountVnp) ? amountVnp / 100 : 0);
            if (payment.Amount != paymentAmountVND)
            {
                _logger.LogError("VNPay IPN Error: Amount mismatch for OrderId {OrderId}.", payment.OrderId);
                return new VNPayIPNResponse { RspCode = "04", Message = "Invalid amount" };
            }

            // 5. Idempotency Check (Kiểm tra xem đã xử lý chưa)
            if (payment.Status != "Pending")
            {
                _logger.LogWarning("VNPay IPN Info: OrderId {OrderId} already processed. Ignoring duplicate IPN.", payment.OrderId);
                return new VNPayIPNResponse { RspCode = "00", Message = "Confirm Success" };
            }

            // 6. Process based on VNPay Response Codes
            if (vnp_ResponseCode == "00" && vnp_TransactionStatus == "00")
            {
                // --- SUCCESS ---

                // Cập nhật Payment (Giữ nguyên)
                payment.Status = "Succeeded";
                payment.PaidAt = DateTime.UtcNow;
                payment.TransactionId = vnpayData["vnp_TransactionNo"].ToString();
                await _paymentRepository.UpdateAsync(payment);

                // ✅ FIX: TÌM VÀ KÍCH HOẠT ENROLLMENT PENDING
                // 1. Tìm bản ghi Enrollment (có thể là pending hoặc đã enrolled)
                var enrollmentToActivate = await _enrollmentRepository.GetByUserIdAndCourseIdAsync(payment.UserId, payment.CourseId);

                if (enrollmentToActivate != null && enrollmentToActivate.Status == "pending")
                {
                    // 2. KÍCH HOẠT: Cập nhật trạng thái
                    enrollmentToActivate.Status = "enrolled";
                    await _enrollmentRepository.UpdateAsync(enrollmentToActivate);

                    // 3. ĐỒNG BỘ: Tăng TotalStudents
                    await IncrementTotalStudents(payment.CourseId);

                    _logger.LogInformation("Enrollment activated and TotalStudents incremented for User {UserId}.", payment.UserId);
                }
                else if (enrollmentToActivate?.Status == "enrolled")
                {
                    _logger.LogWarning("Enrollment already active (Idempotency). Skipping student count increment.", payment.UserId);
                }
                else
                {
                    _logger.LogError("CRITICAL: Pending Enrollment record not found for successful Order {OrderId}.", payment.OrderId);
                }

                return new VNPayIPNResponse { RspCode = "00", Message = "Confirm Success" };
            }
            else
            {
                // --- FAILURE ---
                _logger.LogWarning("VNPay IPN Failed: OrderId {OrderId}, RspCode={RspCode}, TxnStatus={TxnStatus}. VNPay TxnNo: {TransactionNo}",
                         payment.OrderId, vnp_ResponseCode, vnp_TransactionStatus, vnp_TransactionNo);

                // Update Payment Status
                payment.Status = "Failed";
                payment.TransactionId = vnp_TransactionNo.ToString(); // Store VNPay's ID even on failure
                await _paymentRepository.UpdateAsync(payment);
                _logger.LogInformation("Payment record {PaymentId} updated to Failed.", payment.PaymentId);

                // TODO: Send failure notification to the user or admin if necessary

                // Return success to VNPay to prevent retries for failed payments
                return new VNPayIPNResponse { RspCode = "00", Message = "Confirm Success" };
            }
        }
        private async Task IncrementTotalStudents(Guid courseId)
        {
            var course = await _courseRepository.GetByIdAsync(courseId);

            if (course != null)
            {
                course.TotalStudents += 1;
                // Giả định hàm này gọi SaveChangesAsync trên CourseRepository
                await _courseRepository.UpdateCourseOnlyAsync(course);
            }
        }
    }

}

