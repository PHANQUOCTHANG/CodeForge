using AutoMapper;
using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CodeForge.Infrastructure.Repositories
{
    public class ProgressRepository : IProgressRepository
    {
        private readonly ApplicationDbContext _context;

        public ProgressRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Progress?> GetByUserIdAndLessonIdAsync(Guid userId, Guid lessonId)
        {
            return await _context.Progress
                .FirstOrDefaultAsync(p => p.UserId == userId && p.LessonId == lessonId);
        }

        public async Task<Progress> AddAsync(Progress progress)
        {
            await _context.Progress.AddAsync(progress);
            await _context.SaveChangesAsync();
            return progress;
        }

        public async Task<Progress> UpdateAsync(Progress progress)
        {
            _context.Progress.Update(progress);
            await _context.SaveChangesAsync();
            return progress;
        }

        public async Task<List<Progress>> GetCompletedProgressForCourseAsync(Guid userId, Guid courseId)
        {
            // Truy vấn các bài học thuộc khóa học đó
            var lessonIdsInCourse = _context.Lessons
                .Include(l => l.Module)
                .Where(l => l.Module.CourseId == courseId)
                .Select(l => l.LessonId);

            // Lấy các tiến độ đã hoàn thành
            return await _context.Progress
                .Where(p => p.UserId == userId &&
                            p.Status == "completed" &&
                            lessonIdsInCourse.Contains(p.LessonId))
                .ToListAsync();
        }

        /// <summary>
        /// Đây là logic cốt lõi được chuyển từ CourseRepository.
        /// Nó tính toán % hoàn thành của các khóa học dựa trên số bài học đã "completed".
        /// </summary>
        public async Task<Dictionary<Guid, double>> GetUserProgressSummaryAsync(Guid userId)
        {
            // Lấy tất cả bài học, join với module, course
            // Sau đó LEFT JOIN với progress của user
            var progressData = await (
                from lesson in _context.Lessons
                join module in _context.Modules on lesson.ModuleId equals module.ModuleId
                join course in _context.Courses on module.CourseId equals course.CourseId
                join enrollment in _context.Enrollments on course.CourseId equals enrollment.CourseId

                // Chỉ tính toán cho các khóa học mà người dùng đã đăng ký
                where enrollment.UserId == userId

                join progress in _context.Progress
                    .Where(p => p.UserId == userId && p.Status == "completed")
                    on lesson.LessonId equals progress.LessonId into lessonProgress

                from lp in lessonProgress.DefaultIfEmpty() // LEFT JOIN: lp == null nếu chưa completed

                group lp by course.CourseId into g
                select new
                {
                    CourseId = g.Key,
                    // Đếm số bài học đã hoàn thành (không null)
                    CompletedCount = g.Count(x => x != null),
                    // Đếm tổng số bài học trong nhóm (tương ứng tổng số bài học của khóa học)
                    TotalCount = g.Count()
                }
            ).ToListAsync();

            return progressData.ToDictionary(
                x => x.CourseId,
                // Tính toán % và làm tròn 2 chữ số
                x => x.TotalCount == 0 ? 0 : Math.Round((double)x.CompletedCount / x.TotalCount * 100, 2)
            );
        }
    }
}