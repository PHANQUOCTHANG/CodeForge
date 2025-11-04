using AutoMapper;
using CodeForge.Application.DTOs.Response;
using CodeForge.Core.Entities;
using CodeForge.Core.Exceptions;
using CodeForge.Core.Interfaces.Repositories;

namespace CodeForge.Core.Services
{
    public class ProgressService : IProgressService
    {
        private readonly IProgressRepository _progressRepository;
        private readonly IEnrollmentRepository _enrollmentRepository;
        private readonly ILessonRepository _lessonRepository; // Cần tạo repository này
        private readonly IMapper _mapper;

        public ProgressService(
            IProgressRepository progressRepository,
            IEnrollmentRepository enrollmentRepository,
            ILessonRepository lessonRepository,
            IMapper mapper)
        {
            _progressRepository = progressRepository;
            _enrollmentRepository = enrollmentRepository;
            _lessonRepository = lessonRepository;
            _mapper = mapper;
        }

        /// <summary>
        /// Logic nghiệp vụ chính: Cập nhật tiến độ.
        /// </summary>
        public async Task<ProgressDto> UpdateProgressAsync(Guid userId, Guid lessonId, string status)
        {
            // 1. Kiểm tra nghiệp vụ: Bài học (Lesson) có tồn tại không?
            //    Chúng ta cần một cách để lấy CourseId từ LessonId.
            var courseId = await _lessonRepository.GetCourseIdByLessonIdAsync(lessonId);
            if (courseId == null)
            {
                throw new NotFoundException($"Bài học (Lesson) với ID {lessonId} không tồn tại.");
            }

            // 2. Kiểm tra nghiệp vụ: Người dùng đã đăng ký khóa học này chưa?
            bool isEnrolled = await _enrollmentRepository.ExistsAsync(userId, courseId.Value);
            if (!isEnrolled)
            {
                throw new ConflictException("Bạn phải đăng ký khóa học trước khi cập nhật tiến độ.");
            }

            // 3. Thực thi (UPSERT): Tìm bản ghi tiến độ
            var existingProgress = await _progressRepository.GetByUserIdAndLessonIdAsync(userId, lessonId);

            Progress result;
            if (existingProgress == null)
            {
                // Tạo mới nếu chưa có
                var newProgress = new Progress
                {
                    UserId = userId,
                    LessonId = lessonId,
                    Status = status,
                    UpdatedAt = DateTime.UtcNow
                };
                result = await _progressRepository.AddAsync(newProgress);
            }
            else
            {
                // Cập nhật nếu đã tồn tại
                existingProgress.Status = status;
                existingProgress.UpdatedAt = DateTime.UtcNow;
                result = await _progressRepository.UpdateAsync(existingProgress);
            }

            return _mapper.Map<ProgressDto>(result);
        }

        /// <summary>
        /// Lấy chi tiết tiến độ (chỉ các bài đã 'completed').
        /// </summary>
        public async Task<List<ProgressDto>> GetProgressForCourseAsync(Guid userId, Guid courseId)
        {
            var progressList = await _progressRepository.GetCompletedProgressForCourseAsync(userId, courseId);
            return _mapper.Map<List<ProgressDto>>(progressList);
        }

        /// <summary>
        /// Lấy tóm tắt % tiến độ.
        /// </summary>
        public async Task<Dictionary<Guid, double>> GetUserProgressSummaryAsync(Guid userId)
        {
            // Chỉ cần gọi thẳng repository vì logic đã nằm ở đó
            return await _progressRepository.GetUserProgressSummaryAsync(userId);
        }
    }
}