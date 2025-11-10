using AutoMapper;
using CodeForge.Api.Controllers;
using CodeForge.Api.DTOs.Response;
using CodeForge.Application.DTOs; // For EnrollmentProcessResult
using CodeForge.Core.Entities;
using CodeForge.Core.Exceptions;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Core.Interfaces.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging; // Add logging
using System;
using System.Threading.Tasks;

namespace CodeForge.Core.Services
{
    public class EnrollmentService : IEnrollmentService
    {
        private readonly IEnrollmentRepository _enrollmentRepository;
        private readonly ICourseRepository _courseRepository;
        private readonly IPaymentService _paymentService; // Inject PaymentService
        private readonly IMapper _mapper;
        private readonly ILogger<EnrollmentService> _logger; // Add logger

        public EnrollmentService(
            IEnrollmentRepository enrollmentRepository,
            ICourseRepository courseRepository,
            IPaymentService paymentService, // Add PaymentService
            IMapper mapper,
            ILogger<EnrollmentService> logger) // Add logger
        {
            _enrollmentRepository = enrollmentRepository ?? throw new ArgumentNullException(nameof(enrollmentRepository));
            _courseRepository = courseRepository ?? throw new ArgumentNullException(nameof(courseRepository));
            _paymentService = paymentService ?? throw new ArgumentNullException(nameof(paymentService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<EnrollmentProcessResult> ProcessEnrollmentRequestAsync(Guid userId, Guid courseId, HttpContext httpContext)
        {
            // 1. Validate Course Exists
            var course = await _courseRepository.GetByIdAsync(courseId);
            if (course == null || course.IsDeleted) // Check IsDeleted if you have soft delete
            {
                _logger.LogWarning("Enrollment attempt failed: Course {CourseId} not found or deleted.", courseId);
                throw new NotFoundException($"Khóa học với ID {courseId} không tồn tại.");
            }


            // 2. Check if Already Enrolled
            bool alreadyEnrolled = await _enrollmentRepository.ExistsAsync(userId, courseId);
            if (alreadyEnrolled)
            {
                _logger.LogWarning("Enrollment attempt failed: User {UserId} already enrolled in Course {CourseId}.", userId, courseId);
                throw new ConflictException("Bạn đã đăng ký khóa học này rồi.");
            }

            // 3. Check Price
            // decimal priceToPay = course.Price * (1 - (course.Discount / 100)); // Consider discount logic accuracy
            decimal priceToPay = course.Price; // Start with base price
            if (course.Discount > 0 && course.Discount <= 100) // Ensure discount is valid
            {
                priceToPay = course.Price * (1 - (course.Discount / 100));
            }
            // Ensure price doesn't go below zero
            priceToPay = Math.Max(0, priceToPay);


            // 4. Handle Free vs Paid
            if (priceToPay <= 0)
            {
                // --- Free Course ---
                _logger.LogInformation("Processing free enrollment for User {UserId}, Course {CourseId}.", userId, courseId);
                var enrollment = await CreateEnrollmentDirectly(userId, courseId); // Use helper function
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
                // Call PaymentService to create VNPay URL

                string paymentUrl = await _paymentService.CreateVNPayPaymentAsync(userId, courseId, priceToPay, httpContext);
                return new EnrollmentProcessResult
                {
                    IsPaymentRequired = true,
                    PaymentInfo = new { paymentUrl } // Return the URL
                };
            }
        }

        // Helper for direct enrollment (free courses or manual admin action)
        public async Task<EnrollmentDto> CreateEnrollmentAsync(Guid userId, Guid courseId)
        {
            // You might want similar validation as ProcessEnrollmentRequestAsync here
            var course = await _courseRepository.GetByIdAsync(courseId)
                ?? throw new NotFoundException($"Khóa học với ID {courseId} không tồn tại.");
            if (await _enrollmentRepository.ExistsAsync(userId, courseId))
            {
                throw new ConflictException("Bạn đã đăng ký khóa học này rồi.");
            }

            var enrollment = await CreateEnrollmentDirectly(userId, courseId);
            return _mapper.Map<EnrollmentDto>(enrollment);
        }


        // Centralized logic to create the enrollment record
        private async Task<Enrollment> CreateEnrollmentDirectly(Guid userId, Guid courseId)
        {
            var newEnrollment = new Enrollment
            {
                EnrollmentId = Guid.NewGuid(),
                UserId = userId,
                CourseId = courseId,
                EnrolledAt = DateTime.UtcNow,
                Status = "enrolled"
            };
            return await _enrollmentRepository.AddAsync(newEnrollment);
        }

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