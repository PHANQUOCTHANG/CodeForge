using AutoMapper;
using CodeForge.Api.Controllers;
using CodeForge.Api.DTOs;
using CodeForge.Api.DTOs.Response;

using CodeForge.Core.Entities;
using CodeForge.Core.Exceptions;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Core.Interfaces.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CodeForge.Core.Services
{
    public class EnrollmentService : IEnrollmentService
    {
        private readonly IEnrollmentRepository _enrollmentRepository;
        private readonly ICourseRepository _courseRepository;
        private readonly IPaymentService _paymentService;
        private readonly IMapper _mapper;
        private readonly ILogger<EnrollmentService> _logger;

        public EnrollmentService(
            IEnrollmentRepository enrollmentRepository,
            ICourseRepository courseRepository,
            IPaymentService paymentService,
            IMapper mapper,
            ILogger<EnrollmentService> logger)
        {
            _enrollmentRepository = enrollmentRepository ?? throw new ArgumentNullException(nameof(enrollmentRepository));
            _courseRepository = courseRepository ?? throw new ArgumentNullException(nameof(courseRepository));
            _paymentService = paymentService ?? throw new ArgumentNullException(nameof(paymentService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }


        // ========================================================
        // 🎯 LOGIC CHÍNH: XỬ LÝ YÊU CẦU ĐĂNG KÝ
        // ========================================================
        public async Task<EnrollmentProcessResult> ProcessEnrollmentRequestAsync(Guid userId, Guid courseId, HttpContext httpContext)
        {
            // 1. Validate Course Exists
            var course = await _courseRepository.GetByIdAsync(courseId);
            if (course == null || course.IsDeleted)
            {
                _logger.LogWarning("Enrollment attempt failed: Course {CourseId} not found or deleted.", courseId);
                throw new NotFoundException($"Khóa học với ID {courseId} không tồn tại.");
            }

            // 2. Check if Already Enrolled (Tránh Conflict)
            // ✅ FIX: Cần kiểm tra cả trạng thái 'enrolled' và 'pending'
            if (await _enrollmentRepository.ExistsAsync(userId, courseId))
            {
                // Nếu tồn tại bất kỳ bản ghi nào (enrolled hoặc pending), 
                // ta lấy nó ra để kiểm tra trạng thái cụ thể.
                var existingEnrollment = await _enrollmentRepository.GetByUserIdAndCourseIdAsync(userId, courseId);

                if (existingEnrollment?.Status == "enrolled")
                {
                    _logger.LogWarning("Enrollment attempt failed: User {UserId} already enrolled.", userId);
                    throw new ConflictException("Bạn đã đăng ký khóa học này rồi (Đã hoàn tất).");
                }

                // Nếu trạng thái là PENDING, ta sẽ tái sử dụng nó ở bước 4.
            }


            // 3. Calculate Price
            decimal priceToPay = Math.Max(0, course.Price * (1 - (course.Discount / 100)));


            // 4. Handle Free vs Paid
            if (priceToPay <= 0)
            {
                // --- Free Course ---
                _logger.LogInformation("Processing free enrollment for User {UserId}, Course {CourseId}.", userId, courseId);

                // ✅ Tái sử dụng helper để tạo Enrollment "enrolled" và cập nhật TotalStudents
                var enrollment = await CreateEnrollmentDirectly(userId, courseId, "enrolled");

                return new EnrollmentProcessResult
                {
                    IsPaymentRequired = false,
                    EnrollmentInfo = _mapper.Map<EnrollmentDto>(enrollment)
                };
            }
            else
            {
                // --- Paid Course ---
                _logger.LogInformation("Initiating VNPay payment for User {UserId}, Course {CourseId}, Amount {Amount}.", userId, courseId, priceToPay);

                // ✅ FIX & LOGIC: Tái sử dụng hoặc tạo mới bản ghi 'pending'
                Enrollment enrollmentToProcess;
                var existingPendingEnrollment = await _enrollmentRepository.GetPendingEnrollmentAsync(userId, courseId); // Giả định hàm này tồn tại

                if (existingPendingEnrollment != null)
                {
                    // Tái sử dụng bản ghi Pending đã có (để tránh trùng lặp)
                    enrollmentToProcess = existingPendingEnrollment;
                    _logger.LogInformation("Re-using existing pending enrollment record.");
                }
                else
                {
                    // Tạo bản ghi Pending mới
                    enrollmentToProcess = await CreateEnrollmentDirectly(userId, courseId, "pending");
                }

                // Khởi tạo thanh toán VNPay (PaymentService sẽ tự kiểm tra và tái sử dụng Payment record)
                string paymentUrl = await _paymentService.CreateVNPayPaymentAsync(userId, courseId, priceToPay, httpContext);

                return new EnrollmentProcessResult
                {
                    IsPaymentRequired = true,
                    PaymentInfo = new { paymentUrl }
                };
            }
        }

        // ------------------------------------------------------------------------
        // HÀM HELPER ĐÃ CẬP NHẬT (Cần thiết cho logic trên)
        // ------------------------------------------------------------------------

        /*
        // Giả định hàm này tồn tại trong EnrollmentRepository
        public async Task<Enrollment?> GetPendingEnrollmentAsync(Guid userId, Guid courseId)
        {
            return await _enrollmentRepository.GetByUserIdAndCourseIdAsync(userId, courseId, "pending"); // Giả định có thể tìm theo status
        }
        */

        // ========================================================
        // 🔨 HÀM TRỢ GIÚP NỘI BỘ
        // ========================================================

        // Centralized logic to create the enrollment record
        private async Task<Enrollment> CreateEnrollmentDirectly(Guid userId, Guid courseId, string status)
        {
            var newEnrollment = new Enrollment
            {
                UserId = userId,
                CourseId = courseId,
                EnrolledAt = DateTime.UtcNow,
                Status = status
            };
            var addedEnrollment = await _enrollmentRepository.AddAsync(newEnrollment);

            // TĂNG SỐ LƯỢNG HỌC VIÊN CHỈ KHI TRẠNG THÁI LÀ 'enrolled'
            if (status == "enrolled")
            {
                await IncrementTotalStudents(courseId);
            }

            return addedEnrollment;
        }

        // --- Hàm helper: Cập nhật TotalStudents ---
        private async Task IncrementTotalStudents(Guid courseId)
        {
            var course = await _courseRepository.GetByIdAsync(courseId);

            if (course != null)
            {
                course.TotalStudents += 1;
                await _courseRepository.UpdateCourseOnlyAsync(course);
            }
        }

        // ========================================================
        // 🌐 CÁC CHỨC NĂNG CÔNG KHAI KHÁC
        // ========================================================

        // Helper for direct enrollment (used by admin or manual system)
        public async Task<EnrollmentDto> CreateEnrollmentAsync(Guid userId, Guid courseId)
        {
            var course = await _courseRepository.GetByIdAsync(courseId)
                 ?? throw new NotFoundException($"Khóa học với ID {courseId} không tồn tại.");
            if (await _enrollmentRepository.ExistsAsync(userId, courseId))
            {
                throw new ConflictException("Bạn đã đăng ký khóa học này rồi.");
            }

            // ✅ FIX: Gọi hàm helper với status "enrolled"
            var enrollment = await CreateEnrollmentDirectly(userId, courseId, "enrolled");

            return _mapper.Map<EnrollmentDto>(enrollment);
        }

        // ... (Các phương thức GetEnrollmentsByUserIdAsync, DeleteEnrollmentAsync, IsUserEnrolledAsync giữ nguyên) ...
        public async Task<List<EnrollmentDto>> GetEnrollmentsByUserIdAsync(Guid userId)
        {
            var enrollments = await _enrollmentRepository.GetByUserIdAsync(userId); // Assuming repo has this method
            return _mapper.Map<List<EnrollmentDto>>(enrollments);
        }

        public async Task<bool> DeleteEnrollmentAsync(Guid userId, Guid courseId)
        {
            var enrollment = await _enrollmentRepository.GetByUserIdAndCourseIdAsync(userId, courseId); // Assuming repo has this
            if (enrollment == null)
            {
                throw new NotFoundException("Không tìm thấy thông tin đăng ký để hủy.");
            }
            await _enrollmentRepository.DeleteAsync(enrollment); // Assuming repo has this
            return true;
        }
        public async Task<bool> IsUserEnrolledAsync(Guid userId, Guid courseId)
        {
            return await _enrollmentRepository.ExistsAsync(userId, courseId);
        }
    }
}