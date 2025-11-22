using AutoMapper;
using CodeForge.Api.DTOs.Lessons;
using CodeForge.Api.DTOs.Response;
using CodeForge.Core.Entities;
using CodeForge.Core.Exceptions;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Core.Services;

namespace CodeForge.Core.Services
{
    public class LessonService : ILessonService
    {
        private readonly ILessonRepository _lessonRepository;
        private readonly IModuleRepository _moduleRepository; // Cần để kiểm tra quyền (lấy CourseId)
        private readonly IEnrollmentRepository _enrollmentRepository;
        private readonly IProgressRepository _progressRepository;
        private readonly IMapper _mapper;

        public LessonService(
            ILessonRepository lessonRepository,
            IModuleRepository moduleRepository,
            IEnrollmentRepository enrollmentRepository,
            IProgressRepository progressRepository,
            IMapper mapper)
        {
            _lessonRepository = lessonRepository;
            _moduleRepository = moduleRepository;
            _progressRepository = progressRepository;
            _enrollmentRepository = enrollmentRepository;
            _mapper = mapper;
        }

        public async Task<List<LessonDto>> GetLessonsByModuleAsync(Guid moduleId, Guid userId)
        {
            // 1. Kiểm tra quyền
            var courseId = await _moduleRepository.GetCourseIdByModuleIdAsync(moduleId); // Cần thêm hàm này vào IModuleRepository
            if (courseId == null)
            {
                throw new NotFoundException($"Module với ID {moduleId} không tồn tại.");
            }

            bool isEnrolled = await _enrollmentRepository.ExistsAsync(userId, courseId.Value);
            if (!isEnrolled)
            {
                throw new ForbiddenException("Bạn phải đăng ký khóa học để xem danh sách bài học.");
            }

            // 2. Lấy dữ liệu
            var lessons = await _lessonRepository.GetByModuleIdAsync(moduleId);
            return _mapper.Map<List<LessonDto>>(lessons);
        }
        public async Task<LessonDto> GetLessonDetailAsync(Guid lessonId, Guid userId)
        {
            // 1. Get CourseId (check if lesson exists)
            // (Using ModuleRepo is slightly more efficient if GetCourseIdByLessonIdAsync joins Module anyway)
            var ids = await _moduleRepository.GetModuleAndCourseIdsByLessonIdAsync(lessonId);
            if (ids.CourseId == null)
            {
                throw new NotFoundException($"Bài học với ID {lessonId} không tồn tại.");
            }
            Guid courseId = ids.CourseId.Value;


            // 2. Check Enrollment (using CourseId obtained above)
            bool isEnrolled = await _enrollmentRepository.ExistsAsync(userId, courseId);
            if (!isEnrolled)
            {
                // Throw Forbidden if user isn't enrolled
                throw new ForbiddenException("Bạn phải đăng ký khóa học để xem bài học này.");
            }

            // 3. Get Lesson Entity Data
            var lessonEntity = await _lessonRepository.GetByIdAsync(lessonId);
            if (lessonEntity == null) // Should technically be caught by step 1, but good failsafe
            {
                throw new NotFoundException($"Bài học với ID {lessonId} không tồn tại (lỗi nội bộ).");
            }


            // 4. ✅ Check Completion Status for THIS lesson
            var progress = await _progressRepository.GetByUserIdAndLessonIdAsync(userId, lessonId);
            bool isCompleted = progress != null && progress.Status == "completed";

            // 5. Map Entity to DTO
            var lessonDto = _mapper.Map<LessonDto>(lessonEntity);

            // 6. ✅ Set the IsComplete flag on the DTO
            lessonDto.IsCompleted = isCompleted;

            return lessonDto;
        }

        public async Task<LessonDto> CreateLessonAsync(CreateLessonDto createDto, Guid userId)
        {
            // 2. Map và Tạo Lesson chính
            var lesson = _mapper.Map<Lesson>(createDto);
            var newLesson = await _lessonRepository.AddAsync(lesson);

            // 3. Tạo nội dung chi tiết (Video, Text,...)
            // Cần thêm các Repository cho LessonVideo, LessonText...
            // Ví dụ:
            if (createDto.LessonType == "video" && createDto.VideoContent != null)
            {
                // var video = new LessonVideo { 
                //     LessonId = newLesson.LessonId, 
                //     VideoUrl = createDto.VideoContent.VideoUrl 
                // };
                // await _lessonVideoRepository.AddAsync(video);
            }

            // 4. Lấy lại dữ liệu đầy đủ để trả về
            var fullLesson = await _lessonRepository.GetByIdAsync(newLesson.LessonId);
            return _mapper.Map<LessonDto>(fullLesson);
        }

        // ... Các phương thức Update/Delete
    }
}