
using AutoMapper;
using CodeForge.Core.Entities;
using CodeForge.Infrastructure.Data;
using CodeForge.Api.DTOs.Request.Course;
using CodeForge.Core.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CodeForge.Infrastructure.Repositories
{
    public class CourseRepository : ICourseRepository
    {

        private readonly ApplicationDbContext _context;

        private readonly IMapper _mapper;
        public CourseRepository(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<(IEnumerable<Course> Data, int TotalItems)> GetPagedCoursesAsync(
            int page, int pageSize, string? search, string? level, string? status)
        {
            var query = _context.Courses
                .Include(c => c.Category)
                .Include(c => c.User)
                .Where(c => !c.IsDeleted);

            if (!string.IsNullOrWhiteSpace(status) && status != "all")
                query = query.Where(c => c.Status.Contains(status));

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(c => c.Title.Contains(search));

            if (!string.IsNullOrWhiteSpace(level) && level != "all")
                query = query.Where(c => c.Level.Contains(level));

            var totalItems = await query.CountAsync();

            var data = await query
                .OrderByDescending(c => c.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (data, totalItems);
        }
        public async Task<Course> AddAsync(Course course)
        {
            await _context.Courses.AddAsync(course);
            // KHÔNG GỌI SaveChangesAsync() ở đây
            return course;
        }
        public async Task<Dictionary<Guid, double>> GetUserCourseProgressAsync(Guid userId)
        {
            var progressData = await (
                from lesson in _context.Lessons
                join module in _context.Modules on lesson.ModuleId equals module.ModuleId
                join course in _context.Courses on module.CourseId equals course.CourseId
                join progress in _context.Progress
                    .Where(p => p.UserId == userId && p.Status == "completed")
                    on lesson.LessonId equals progress.LessonId into lessonProgress
                from lp in lessonProgress.DefaultIfEmpty() // LEFT JOIN: lp == null nếu chưa completed
                group lp by course.CourseId into g
                select new
                {
                    CourseId = g.Key,
                    CompletedCount = g.Count(x => x != null),
                    TotalCount = g.Count()
                }
            ).ToListAsync();

            return progressData.ToDictionary(
                x => x.CourseId,
                x => x.TotalCount == 0 ? 0 : Math.Round((double)x.CompletedCount / x.TotalCount * 100, 2)
            );
        }



        public async Task<Course?> GetBySlugAsync(string slug)
        {
            var course = await _context.Courses
                .Include(c => c.Category) // Tải Category
                .Include(c => c.User)     // Tải thông tin tác giả (User)

                // --- Tải nội dung lồng nhau (Đã tối ưu) ---
                // EF Core yêu cầu bạn lặp lại đường dẫn Include từ gốc 
                // cho mỗi nhánh ThenInclude khác nhau từ cùng một collection (Lessons).

                // Đường dẫn 1: Tải Modules -> Lessons -> CodingProblem
                .Include(c => c.Modules.OrderBy(m => m.OrderIndex))
                    .ThenInclude(m => m.Lessons.OrderBy(l => l.OrderIndex))
                        .ThenInclude(l => l.CodingProblem)

                // Đường dẫn 2: Tải Modules -> Lessons -> LessonVideo
                .Include(c => c.Modules.OrderBy(m => m.OrderIndex))
                    .ThenInclude(m => m.Lessons.OrderBy(l => l.OrderIndex))
                        .ThenInclude(l => l.LessonVideo)

                // Đường dẫn 3: Tải Modules -> Lessons -> LessonText
                .Include(c => c.Modules.OrderBy(m => m.OrderIndex))
                    .ThenInclude(m => m.Lessons.OrderBy(l => l.OrderIndex))
                        .ThenInclude(l => l.LessonText)

                // Đường dẫn 4: Tải Modules -> Lessons -> LessonQuiz -> QuizQuestions
                .Include(c => c.Modules.OrderBy(m => m.OrderIndex))
                    .ThenInclude(m => m.Lessons.OrderBy(l => l.OrderIndex))
                        .ThenInclude(l => l.LessonQuiz) // 1. Đi vào LessonQuiz (1-1)
                            .ThenInclude(lq => lq!.Questions) // 2. TỪ LessonQuiz đi vào QuizQuestions (1-N)
                                                              // Dùng '!' (null-forgiving operator) để báo cho C#
                                                              // rằng bạn biết lq có thể null, nhưng nếu không null, hãy tải Questions.

                // --- Tối ưu hóa ---
                .AsSplitQuery() // ✅ Rất quan trọng! Chia truy vấn để tránh "Cartesian Explosion".

                // --- Điều kiện lọc ---
                .FirstOrDefaultAsync(c => c.Slug == slug && !c.IsDeleted);

            return course;
        }

        public async Task<Course> CreateAsync(CreateCourseDto createCourseDto)
        {
            Course newCourse = _mapper.Map<Course>(createCourseDto);
            _context.Courses.Add(newCourse);
            await _context.SaveChangesAsync();
            return newCourse;
        }

        public async Task<bool> DeleteAsync(Guid CourseId)
        {
            Course? course = await _context.Courses.FindAsync(CourseId);
            if (course == null) return false;
            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Course>> GetAllAsync(QueryParameters query)
        {
            int limit = query.Limit, page = query.Page;
            return await _context.Courses.Include(u => u.User).Skip(limit * (page - 1)).Take(limit).ToListAsync();
        }
        // Hàm cập nhật đơn giản
        public async Task UpdateCourseOnlyAsync(Course course)
        {
            _context.Courses.Update(course);
            await _context.SaveChangesAsync();
        }
        public async Task<Course?> GetByIdAsync(Guid courseId)
        {
            return await _context.Courses
            .FirstOrDefaultAsync(c => c.CourseId == courseId);
        }
        public async Task<Course?> GetCourseByIdWithDeletedAsync(Guid courseId)
        {
            var course = await _context.Courses
                .IgnoreQueryFilters() // 👈 [QUAN TRỌNG NHẤT] Tắt bộ lọc IsDeleted
                .Include(c => c.Category)
                .Include(c => c.User)

                // --- Tải nội dung lồng nhau (Copy logic từ GetBySlugAsync) ---

                // 1. CodingProblem
                .Include(c => c.Modules.OrderBy(m => m.OrderIndex))
                    .ThenInclude(m => m.Lessons.OrderBy(l => l.OrderIndex))
                        .ThenInclude(l => l.CodingProblem)

                // 2. LessonVideo
                .Include(c => c.Modules.OrderBy(m => m.OrderIndex))
                    .ThenInclude(m => m.Lessons.OrderBy(l => l.OrderIndex))
                        .ThenInclude(l => l.LessonVideo)

                // 3. LessonText
                .Include(c => c.Modules.OrderBy(m => m.OrderIndex))
                    .ThenInclude(m => m.Lessons.OrderBy(l => l.OrderIndex))
                        .ThenInclude(l => l.LessonText)

                // 4. Quiz
                .Include(c => c.Modules.OrderBy(m => m.OrderIndex))
                    .ThenInclude(m => m.Lessons.OrderBy(l => l.OrderIndex))
                        .ThenInclude(l => l.LessonQuiz)
                            .ThenInclude(lq => lq!.Questions)

                .AsSplitQuery() // Tối ưu hiệu năng

                // Điều kiện tìm kiếm (Không cần check !IsDeleted nữa)
                .FirstOrDefaultAsync(c => c.CourseId == courseId);

            return course;
        }
        public async Task<Course?> UpdateAsync(UpdateCourseDto updateCourseDto)
        {
            Course? course = await _context.Courses.FindAsync(updateCourseDto.CourseId);

            if (course == null)
                return null;

            // Map các property từ DTO sang entity đang được track
            _mapper.Map(updateCourseDto, course);

            await _context.SaveChangesAsync();
            return course;
        }

        public async Task<bool> ExistsByTitleAsync(string title)
        {
            Course? course = await _context.Courses.FirstOrDefaultAsync(p => p.Title == title);
            return course != null;
        }
        public async Task<bool> ExistsBySlugAsync(string slug)
        {
            Course? course = await _context.Courses.FirstOrDefaultAsync(c => c.Slug == slug);
            return course != null;
        }
    }
}