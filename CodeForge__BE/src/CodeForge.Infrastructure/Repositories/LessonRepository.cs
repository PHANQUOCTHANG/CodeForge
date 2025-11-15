using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CodeForge.Infrastructure.Repositories
{
    public class LessonRepository : ILessonRepository
    {
        private readonly ApplicationDbContext _context;

        public LessonRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Phương thức hỗ trợ ProgressService.
        /// Tìm bài học, join Module để lấy CourseId.
        /// </summary>
        public async Task<Guid?> GetCourseIdByLessonIdAsync(Guid lessonId)
        {
            var lesson = await _context.Lessons
                .Include(l => l.Module)
                .Where(l => l.LessonId == lessonId)
                .Select(l => l.Module.CourseId) // Chỉ cần lấy CourseId

                .FirstOrDefaultAsync();

            return lesson == Guid.Empty ? null : lesson;
        }

        public async Task<Lesson?> GetByIdAsync(Guid lessonId)
        {
            var lesson = await _context.Lessons
                // Load các thành phần cấp 1
                .Include(l => l.LessonVideo) // Video (Nếu là bài học Video)
                .Include(l => l.LessonText)  // Văn bản (Nếu là bài học Text)

                // Tải Quiz và các Câu hỏi lồng nhau
                .Include(l => l.LessonQuiz)
                    .ThenInclude(lq => lq.Questions) // ✅ Tải các câu hỏi của Quiz

                .Include(l => l.CodingProblem) // Coding Problem (Nếu là bài học Code)

                // Luôn nên thêm .AsNoTracking() nếu bạn chỉ đọc dữ liệu
                // Nếu bạn muốn chỉnh sửa Lesson, hãy loại bỏ nó.
                .AsNoTracking()
                .FirstOrDefaultAsync(l => l.LessonId == lessonId);

            return lesson;
        }

        public async Task<List<Lesson>> GetByModuleIdAsync(Guid moduleId)
        {
            return await _context.Lessons
                .Where(l => l.ModuleId == moduleId)
                .OrderBy(l => l.OrderIndex)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Lesson> AddAsync(Lesson lesson)
        {
            // Lưu ý: Logic thêm LessonVideo/Text... 
            // nên được xử lý trong Service sau khi Lesson gốc được tạo.
            await _context.Lessons.AddAsync(lesson);
            await _context.SaveChangesAsync();
            return lesson;
        }

        public async Task<Lesson> UpdateAsync(Lesson lesson)
        {
            _context.Lessons.Update(lesson);
            await _context.SaveChangesAsync();
            return lesson;
        }

        public async Task DeleteAsync(Lesson lesson)
        {
            // Cần xử lý xóa các bảng con (Video, Text,...) trước nếu 
            // không có CASCADE DELETE ở mức database.
            _context.Lessons.Remove(lesson);
            await _context.SaveChangesAsync();
        }
    }
}