using AutoMapper;
using CodeForge.Api.DTOs.Response; // Giả định PaginationResult nằm đây
using CodeForge.Core.Entities;
using CodeForge.Api.DTOs.Request.Course;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge__BE.src.CodeForge.Core.Interfaces.Services;
using CodeForge.Core.Models; // Giả định PaginationResult nằm đây
using CodeForge.Core.Helpers; // SlugHelper
using Microsoft.EntityFrameworkCore; // <-- Added to enable Include/ThenInclude extensions
using Microsoft.EntityFrameworkCore.Storage;
using CodeForge.Core.Exceptions;
using CodeForge.Application.DTOs.Response;
using CodeForge.Core.Services;
using CodeForge.Infrastructure.Data;
using CodeForge.Api.DTOs; // ✅ Import Custom Exceptions
using CodeForge.Application.DTOs.Lessons;

namespace CodeForge__BE.src.CodeForge.Core.Services
{
    public class CourseService : ICourseService
    {
        private readonly ApplicationDbContext _context; // 👈 [QUAN TRỌNG] Inject DbContext
        private readonly ICourseRepository _courseRepository;
        private readonly IEnrollmentRepository _enrollmentRepository;
        private readonly IProgressService _progressService;
        private readonly ILogger<CourseService> _logger;
        private readonly IMapper _mapper;

        public CourseService(ApplicationDbContext context, ILogger<CourseService> logger, ICourseRepository courseRepository, IEnrollmentRepository enrollmentRepository, IProgressService progressService, IMapper mapper)
        {
            _context = context;
            _courseRepository = courseRepository;
            _enrollmentRepository = enrollmentRepository;
            _progressService = progressService;
            _logger = logger;
            _mapper = mapper;
        }

        // --- GET Paged --- (Không cần sửa)
        public async Task<PaginationResult<object>> GetPagedCoursesAsync(
            Guid? userId, int page, int pageSize, string? search, string? level, string? status)
        {
            var (courses, totalItems) = await _courseRepository.GetPagedCoursesAsync(page, pageSize, search, level, status);

            var result = _mapper.Map<IEnumerable<CourseDto>>(courses);

            if (userId.HasValue)
            {
                // Phải chạy tuần tự, KHÔNG song song, vì dùng chung DbContext
                var enrolledIds = await _enrollmentRepository.GetUserEnrolledCourseIdsAsync(userId.Value);
                var progressDict = await _courseRepository.GetUserCourseProgressAsync(userId.Value);

                foreach (var dto in result)
                {
                    dto.IsEnrolled = enrolledIds.Contains(dto.CourseId);
                    dto.Progress = progressDict.TryGetValue(dto.CourseId, out var progress) ? progress : 0;
                }
            }

            return new PaginationResult<object>(
                result,
                totalItems,
                page,
                pageSize
            );
        }

        // --- GET Detail by Slug --- (Không cần sửa)
        public async Task<CourseDetailDto?> GetCourseDetailBySlugAsync(string slug, Guid? userId)
        {
            var course = await _courseRepository.GetBySlugAsync(slug);
            if (course == null) return null;
            var result = _mapper.Map<CourseDetailDto>(course);
            if (userId.HasValue)
            {
                // Phải chạy tuần tự, KHÔNG song song, vì dùng chung DbContext
                var enrolledIds = await _enrollmentRepository.GetUserEnrolledCourseIdsAsync(userId.Value);
                result.IsEnrolled = enrolledIds.Contains(result.CourseId);
                if (result.IsEnrolled)
                {
                    // 3. Lấy dữ liệu tiến độ (chỉ khi đã đăng ký)

                    // Lấy danh sách các bài đã hoàn thành
                    var completedProgressList = await _progressService.GetProgressForCourseAsync(userId.Value, result.CourseId);

                    // Chuyển sang HashSet để tra cứu O(1) (rất nhanh)
                    var completedLessonIds = completedProgressList
                        .Select(p => p.LessonId)
                        .ToHashSet();

                    // Lấy % tổng
                    var progressSummary = await _progressService.GetUserProgressSummaryAsync(userId.Value);
                    result.Progress = progressSummary.TryGetValue(result.CourseId, out var progress) ? progress : 0;

                    // 4. ✅ CẬP NHẬT DTO: Duyệt qua các lesson và gán cờ IsComplete
                    foreach (var module in result.Modules)
                    {
                        foreach (var lesson in module.Lessons)
                        {
                            if (completedLessonIds.Contains(lesson.LessonId))
                            {
                                lesson.IsCompleted = true;
                            }
                        }
                    }
                }
                else
                {
                    // Nếu chưa đăng ký, mọi thứ đều là 0 hoặc false (mặc định)
                    result.Progress = 0;
                }
            }
            // ✅ Không ném lỗi 404 trong Service nếu trả về null là chấp nhận được
            return result;
        }

        // --- CREATE Course ---
        // ✅ Đổi kiểu trả về từ Task<ApiResponse<CourseDto>> sang Task<CourseDto>
        // ... (Các using cần thiết)

        public async Task<CourseDto> CreateCourseAsync(CreateCourseDto createCourseDto, Guid createdByUserId)
        {
            // 1. Validate
            if (await _courseRepository.ExistsByTitleAsync(createCourseDto.Title))
            {
                throw new ConflictException("Tên khóa học đã tồn tại.");
            }

            // 2. Transaction (Bắt buộc để đảm bảo toàn vẹn)
            await using IDbContextTransaction transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // --- A. TẠO COURSE ---
                // AutoMapper chỉ map Title, Desc, Price... (Modules bị Ignore nhờ cấu hình ở bước 1)
                var courseEntity = _mapper.Map<Course>(createCourseDto);

                // Điền các thông tin hệ thống
                courseEntity.CourseId = Guid.NewGuid(); // Tạo ID trước để gán cho con
                courseEntity.CreatedBy = createdByUserId;
                courseEntity.Slug = await GenerateUniqueSlug(createCourseDto.Title);

                // Khởi tạo list rỗng để chắc chắn
                courseEntity.Modules = new List<Module>();

                // Add vào Context (Chưa lưu xuống DB)
                await _context.Courses.AddAsync(courseEntity);
                _logger.LogInformation("Đã thêm Course {CourseId} vào context.", courseEntity.CourseId);

                // --- B. XỬ LÝ MODULES & LESSONS (Vòng lặp thủ công) ---
                if (createCourseDto.Modules != null)
                {
                    foreach (var moduleDto in createCourseDto.Modules)
                    {
                        // Map Module
                        var moduleEntity = _mapper.Map<Module>(moduleDto);
                        moduleEntity.ModuleId = Guid.NewGuid();
                        moduleEntity.CourseId = courseEntity.CourseId; // 🔗 Link với cha
                        moduleEntity.Lessons = new List<Lesson>(); // Khởi tạo list rỗng

                        await _context.Modules.AddAsync(moduleEntity);

                        // Xử lý Lessons của Module này
                        if (moduleDto.Lessons != null)
                        {
                            foreach (var lessonDto in moduleDto.Lessons)
                            {
                                // Map Lesson
                                var lessonEntity = _mapper.Map<Lesson>(lessonDto);
                                lessonEntity.LessonId = Guid.NewGuid();
                                lessonEntity.ModuleId = moduleEntity.ModuleId; // 🔗 Link với cha

                                // Đảm bảo content con là null để tránh lỗi map thừa
                                lessonEntity.LessonVideo = null;
                                lessonEntity.LessonText = null;
                                lessonEntity.LessonQuiz = null;
                                lessonEntity.CodingProblem = null;

                                await _context.Lessons.AddAsync(lessonEntity);

                                // Xử lý Content chi tiết (Switch Case - Tái sử dụng hàm logic)
                                // Chúng ta map DTO create sang DTO update để dùng chung hàm UpdateLessonContent
                                // Hoặc bạn có thể viết hàm AddLessonContent riêng nếu muốn.
                                // Ở đây tôi viết hàm AddLessonContentAsync riêng cho rõ ràng.
                                await AddLessonContentAsync(lessonEntity, lessonDto);
                            }
                        }
                    }
                }

                // 3. TÍNH TOÁN THỐNG KÊ
                courseEntity.LessonCount = createCourseDto.Modules?.Sum(m => m.Lessons.Count) ?? 0;
                // courseEntity.Duration = ... (Tính tổng duration nếu cần)

                // 4. SAVE CHANGES (Chỉ 1 lần duy nhất cho tất cả)
                _logger.LogInformation("Đang lưu khóa học và toàn bộ nội dung...");
                await _context.SaveChangesAsync();

                // 5. COMMIT
                await transaction.CommitAsync();

                // 6. Trả về kết quả
                return _mapper.Map<CourseDto>(courseEntity);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Lỗi khi tạo khóa học. Đã Rollback.");
                throw; // Ném lỗi ra để Controller xử lý
            }
        }

        // --- HÀM PHỤ TRỢ: Thêm nội dung bài học ---
        private async Task AddLessonContentAsync(Lesson lesson, CreateLessonDto dto)
        {
            switch (dto.LessonType.ToLower())
            {
                case "video":
                    if (dto.VideoContent != null)
                    {
                        var video = _mapper.Map<LessonVideo>(dto.VideoContent);
                        video.LessonId = lesson.LessonId; // 🔗 Link 1-1
                        await _context.LessonVideos.AddAsync(video);
                    }
                    break;

                case "text":
                    if (dto.TextContent != null)
                    {
                        var text = _mapper.Map<LessonText>(dto.TextContent);
                        text.LessonId = lesson.LessonId;
                        await _context.LessonTexts.AddAsync(text);
                    }
                    break;

                case "quiz":
                    if (dto.QuizContent != null)
                    {
                        var quiz = _mapper.Map<LessonQuiz>(dto.QuizContent);
                        quiz.LessonId = lesson.LessonId;

                        // AutoMapper có thể đã map Questions, cần xử lý để gán LessonQuizId
                        if (quiz.Questions != null)
                        {
                            foreach (var q in quiz.Questions)
                            {
                                q.LessonQuizId = lesson.LessonId; // Gán ID cha
                                                                  // Không cần AddAsync từng question nếu đã AddAsync quiz và quiz chứa list questions
                                                                  // EF Core sẽ tự hiểu. Nhưng để chắc chắn, ta Add Quiz trước.
                            }
                        }
                        await _context.LessonQuizzes.AddAsync(quiz);
                    }
                    break;

                case "coding":
                    if (dto.CodingProblem != null)
                    {
                        var problem = _mapper.Map<Problem>(dto.CodingProblem); // Chú ý map sang entity CodingProblem
                        problem.LessonId = lesson.LessonId;
                        await _context.CodingProblems.AddAsync(problem);
                    }
                    break;
            }
        }

        // --- DELETE Course ---
        // ✅ Đổi kiểu trả về từ Task<ApiResponse<bool>> sang Task<bool>
        public async Task<bool> DeleteCourseAsync(Guid courseId)
        {
            // Bỏ khối try-catch
            bool result = await _courseRepository.DeleteAsync(courseId);

            // ✅ SỬA: Thay thế return new ApiResponse<bool>(404, ...) bằng NotFoundException
            if (!result)
            {
                throw new NotFoundException($"Course with ID {courseId} not found.");
            }

            // Chỉ trả về giá trị boolean khi thành công
            return true;
        }

        // --- GET All Course ---
        // ✅ Đổi kiểu trả về từ Task<ApiResponse<List<CourseDto>>> sang Task<List<CourseDto>>
        public async Task<List<CourseDto>> GetAllCourseAsync(QueryParameters query)
        {
            // Bỏ khối try-catch
            List<Course> courses = await _courseRepository.GetAllAsync(query);
            return _mapper.Map<List<CourseDto>>(courses);
        }

        // --- GET Course by ID ---
        // ✅ Đổi kiểu trả về từ Task<ApiResponse<CourseDto>> sang Task<CourseDto>
        public async Task<CourseDto> GetCourseByIdAsync(Guid CourseId)
        {
            // Bỏ khối try-catch
            Course? course = await _courseRepository.GetByIdAsync(CourseId);

            // ✅ SỬA: Thay thế return new ApiResponse<CourseDto>(404, ...) bằng NotFoundException
            if (course == null)
            {
                throw new NotFoundException($"Course with ID {CourseId} not found.");
            }

            return _mapper.Map<CourseDto>(course);
        }
        public async Task<CourseDetailDto> GetCourseForAdminAsync(Guid courseId)
        {
            // Gọi Repository với hàm đã IgnoreQueryFilters
            var course = await _courseRepository.GetCourseByIdWithDeletedAsync(courseId);

            if (course == null)
            {
                throw new NotFoundException($"Course with ID {courseId} not found.");
            }

            // Map sang DTO như bình thường
            // AutoMapper sẽ map cả những Module/Lesson có IsDeleted = true
            var result = _mapper.Map<CourseDetailDto>(course);

            // (Tùy chọn) Bạn có thể muốn sắp xếp lại hoặc đánh dấu rõ cái nào đã xóa
            // Ví dụ: result.Modules = result.Modules.OrderBy(...).ToList();

            return result;
        }
        // --- UPDATE Course ---
        // ✅ Đổi kiểu trả về từ Task<ApiResponse<CourseDto>> sang Task<CourseDto>
        // --- UPDATE COURSE (Nested Logic) ---
        // --- UPDATE COURSE (Nested Logic) ---
        public async Task<CourseDto> UpdateCourseAsync(Guid courseId, UpdateCourseDto updateDto)
        {
            // 1. Load toàn bộ Graph hiện tại từ DB
            var existingCourse = await _context.Courses
                .Include(c => c.Modules)
                    .ThenInclude(m => m.Lessons).ThenInclude(l => l.LessonVideo)
                .Include(c => c.Modules)
                    .ThenInclude(m => m.Lessons).ThenInclude(l => l.LessonText)
                .Include(c => c.Modules)
                    .ThenInclude(m => m.Lessons).ThenInclude(l => l.LessonQuiz).ThenInclude(q => q!.Questions)
                .Include(c => c.Modules)
                    .ThenInclude(m => m.Lessons).ThenInclude(l => l.CodingProblem)
                .AsSplitQuery()
                .FirstOrDefaultAsync(c => c.CourseId == courseId);

            if (existingCourse == null)
            {
                throw new NotFoundException($"Course with ID {courseId} not found.");
            }

            // 2. Bắt đầu Transaction
            await using IDbContextTransaction transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // 3. Cập nhật thông tin cơ bản của Course
                _mapper.Map(updateDto, existingCourse);

                // 4. Xử lý Modules (Diffing)
                var moduleIdsInDto = updateDto.Modules?
                    .Where(m => m.ModuleId.HasValue)
                    .Select(m => m.ModuleId!.Value)
                    .ToList() ?? new List<Guid>();

                // A. XÓA (Soft Delete) các Module
                var modulesToDelete = existingCourse.Modules
                    .Where(m => !moduleIdsInDto.Contains(m.ModuleId) && !m.IsDeleted)
                    .ToList();

                foreach (var mod in modulesToDelete)
                {
                    mod.IsDeleted = true;
                    foreach (var l in mod.Lessons) l.IsDeleted = true;
                }

                // ...
                // C. THÊM MỚI HOẶC CẬP NHẬT MODULE
                if (updateDto.Modules != null)
                {
                    foreach (var moduleDto in updateDto.Modules)
                    {
                        if (moduleDto.ModuleId.HasValue)
                        {
                            // --- UPDATE MODULE CŨ ---
                            var existingModule = existingCourse.Modules
                                .FirstOrDefault(m => m.ModuleId == moduleDto.ModuleId.Value);

                            if (existingModule != null)
                            {
                                // 1. Map thông tin cơ bản (Title, OrderIndex...)
                                _mapper.Map(moduleDto, existingModule);

                                // 2. 🌟 [QUAN TRỌNG] Đồng bộ trạng thái IsDeleted từ Frontend
                                // Nếu Frontend gửi true -> Xóa mềm. Nếu false -> Khôi phục.
                                existingModule.IsDeleted = moduleDto.IsDeleted;

                                // 3. Nếu Module bị xóa, có thể tùy chọn xóa luôn các Lesson con để đảm bảo nhất quán
                                if (existingModule.IsDeleted)
                                {
                                    foreach (var l in existingModule.Lessons) l.IsDeleted = true;
                                }
                                else
                                {
                                    // Nếu Module active (hoặc được khôi phục), mới xử lý update lesson con
                                    await UpdateLessonsForModuleAsync(existingModule, moduleDto.Lessons);
                                }
                            }
                        }
                        else
                        {
                            // --- INSERT MODULE MỚI ---
                            // (Chỉ thêm nếu Frontend không đánh dấu xóa ngay lúc tạo - trường hợp hiếm)
                            if (!moduleDto.IsDeleted)
                            {
                                var newModule = _mapper.Map<Module>(moduleDto);
                                newModule.Lessons = new List<Lesson>();
                                existingCourse.Modules.Add(newModule);
                                await UpdateLessonsForModuleAsync(newModule, moduleDto.Lessons);
                            }
                        }
                    }
                }
                // ...

                // 5. Tính toán lại thống kê
                var activeModules = existingCourse.Modules.Where(m => !m.IsDeleted);
                var activeLessons = activeModules.SelectMany(m => m.Lessons).Where(l => !l.IsDeleted).ToList();

                existingCourse.LessonCount = activeLessons.Count;
                existingCourse.Duration = activeLessons.Sum(l => l.Duration);

                // 6. Lưu và Commit
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return _mapper.Map<CourseDto>(existingCourse);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error updating course nested");
                throw new Exception("Failed to update course", ex);
            }
        }

        // --- HÀM PHỤ TRỢ: Xử lý Lessons ---
        private async Task UpdateLessonsForModuleAsync(Module moduleEntity, List<UpdateLessonDto>? lessonDtos)
        {
            if (lessonDtos == null) return;

            // A. Xóa các Lesson KHÔNG có trong danh sách (Phòng hờ)
            var lessonIdsInDto = lessonDtos
                .Where(l => l.LessonId.HasValue)
                .Select(l => l.LessonId!.Value)
                .ToList();

            var lessonsToDelete = moduleEntity.Lessons
                .Where(l => !lessonIdsInDto.Contains(l.LessonId) && !l.IsDeleted)
                .ToList();

            foreach (var l in lessonsToDelete) l.IsDeleted = true;

            // B. Thêm hoặc Cập nhật Lesson
            foreach (var lessonDto in lessonDtos)
            {
                if (lessonDto.LessonId.HasValue)
                {
                    // --- UPDATE LESSON ---
                    var existingLesson = moduleEntity.Lessons
                        .FirstOrDefault(l => l.LessonId == lessonDto.LessonId.Value);

                    if (existingLesson != null)
                    {
                        // 1. Map thông tin cơ bản
                        _mapper.Map(lessonDto, existingLesson);

                        // 2. 🌟 [QUAN TRỌNG] Đồng bộ trạng thái IsDeleted
                        existingLesson.IsDeleted = lessonDto.IsDeleted;

                        // 3. Chỉ update content nếu bài học CHƯA BỊ XÓA (hoặc vừa được khôi phục)
                        if (!existingLesson.IsDeleted)
                        {
                            // Kiểm tra đổi loại bài học
                            if (existingLesson.LessonType != lessonDto.LessonType)
                            {
                                await RemoveOldContent(existingLesson);
                            }
                            await UpdateLessonContent(existingLesson, lessonDto);
                        }
                    }
                }
                else
                {
                    // --- INSERT NEW LESSON ---
                    if (!lessonDto.IsDeleted)
                    {
                        var newLesson = _mapper.Map<Lesson>(lessonDto);
                        moduleEntity.Lessons.Add(newLesson);
                        await UpdateLessonContent(newLesson, lessonDto);
                    }
                }
            }
        }

        // --- HÀM PHỤ TRỢ: Xử lý Content ---
        private async Task UpdateLessonContent(Lesson lesson, UpdateLessonDto dto)
        {
            switch (dto.LessonType.ToLower())
            {
                case "video":
                    if (dto.VideoContent == null) break;
                    if (lesson.LessonVideo == null)
                    {
                        lesson.LessonVideo = _mapper.Map<LessonVideo>(dto.VideoContent);
                    }
                    else
                    {
                        _mapper.Map(dto.VideoContent, lesson.LessonVideo);
                    }
                    break;

                case "text":
                    if (dto.TextContent == null) break;
                    if (lesson.LessonText == null)
                    {
                        lesson.LessonText = _mapper.Map<LessonText>(dto.TextContent);
                    }
                    else
                    {
                        _mapper.Map(dto.TextContent, lesson.LessonText);
                    }
                    break;

                case "quiz":
                    if (dto.QuizContent == null) break;

                    if (lesson.LessonQuiz == null)
                    {
                        // Tạo mới Quiz
                        lesson.LessonQuiz = _mapper.Map<LessonQuiz>(dto.QuizContent);
                        // AutoMapper sẽ tự map Questions nếu cấu hình đúng
                    }
                    else
                    {
                        // Update thông tin Quiz
                        _mapper.Map(dto.QuizContent, lesson.LessonQuiz);

                        // Xử lý Questions (Graph Diffing - QUAN TRỌNG)
                        if (dto.QuizContent.Questions != null)
                        {
                            var existingQuestions = lesson.LessonQuiz.Questions.ToList();
                            var incomingQuestionsDto = dto.QuizContent.Questions;

                            // 1. Xóa câu hỏi cũ
                            var incomingIds = incomingQuestionsDto
                                .Where(q => q.QuestionId.HasValue)
                                .Select(q => q.QuestionId!.Value)
                                .ToList();

                            var questionsToDelete = existingQuestions
                                .Where(q => !incomingIds.Contains(q.QuestionId))
                                .ToList();

                            foreach (var q in questionsToDelete)
                            {
                                lesson.LessonQuiz.Questions.Remove(q);
                                _context.QuizQuestions.Remove(q); // Xóa cứng khỏi DB
                            }

                            // 2. Thêm/Sửa câu hỏi
                            foreach (var qDto in incomingQuestionsDto)
                            {
                                if (qDto.QuestionId.HasValue)
                                {
                                    var existingQ = existingQuestions.FirstOrDefault(q => q.QuestionId == qDto.QuestionId.Value);
                                    if (existingQ != null)
                                    {
                                        _mapper.Map(qDto, existingQ); // Cập nhật
                                    }
                                }
                                else
                                {
                                    var newQ = _mapper.Map<QuizQuestion>(qDto);
                                    lesson.LessonQuiz.Questions.Add(newQ); // Thêm mới
                                }
                            }
                        }
                    }
                    break;

                case "coding":
                    if (dto.CodingProblem == null) break;
                    if (lesson.CodingProblem == null)
                    {
                        lesson.CodingProblem = _mapper.Map<Problem>(dto.CodingProblem);
                    }
                    else
                    {
                        _mapper.Map(dto.CodingProblem, lesson.CodingProblem);
                    }
                    break;
            }
            // Async placeholder nếu cần (hiện tại chưa có IO async trong hàm này)
            await Task.CompletedTask;
        }

        // --- HÀM PHỤ TRỢ: Xóa Content cũ ---
        private Task RemoveOldContent(Lesson lesson)
        {
            if (lesson.LessonVideo != null) _context.LessonVideos.Remove(lesson.LessonVideo);
            if (lesson.LessonText != null) _context.LessonTexts.Remove(lesson.LessonText);
            if (lesson.LessonQuiz != null)
            {
                // Xóa questions trước (Cascade delete thường tự lo, nhưng xóa tay cho chắc)
                if (lesson.LessonQuiz.Questions != null && lesson.LessonQuiz.Questions.Any())
                {
                    _context.QuizQuestions.RemoveRange(lesson.LessonQuiz.Questions);
                }
                _context.LessonQuizzes.Remove(lesson.LessonQuiz);
            }
            if (lesson.CodingProblem != null) _context.CodingProblems.Remove(lesson.CodingProblem);

            return Task.CompletedTask;
        }
        // --- HÀM PHỤ TRỢ: Tạo Slug Unique ---
        private async Task<string> GenerateUniqueSlug(string title)
        {
            string baseSlug = SlugHelper.GenerateSlug(title); // Sử dụng SlugHelper
            string slug = baseSlug;
            int counter = 1;
            
            // Kiểm tra trùng lặp trong DB
            while (await _courseRepository.ExistsBySlugAsync(slug))
            {
                slug = $"{baseSlug}-{counter++}";
            }
            return slug;
        }
    }
}