using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CodeForge.Infrastructure.Repositories
{
    public class EnrollmentRepository : IEnrollmentRepository
    {
        private readonly ApplicationDbContext _context;

        public EnrollmentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ Đây là logic đã được chuyển từ CourseRepository
        public async Task<List<Guid>> GetUserEnrolledCourseIdsAsync(Guid userId)
        {
            return await _context.Enrollments
                .Where(e => e.UserId == userId)
                .Select(e => e.CourseId)
                .ToListAsync();
        }

        public async Task<Enrollment> AddAsync(Enrollment enrollment)
        {
            await _context.Enrollments.AddAsync(enrollment);
            await _context.SaveChangesAsync();
            return enrollment;
        }

        public async Task<Enrollment?> GetByUserIdAndCourseIdAsync(Guid userId, Guid courseId)
        {
            return await _context.Enrollments
                .FirstOrDefaultAsync(e => e.UserId == userId && e.CourseId == courseId);
        }

        public async Task<List<Enrollment>> GetByUserIdAsync(Guid userId)
        {
            return await _context.Enrollments
               .Include(e => e.Course) // Tùy chọn: load cả thông tin khóa học
               .Where(e => e.UserId == userId)
               .ToListAsync();
        }

        public async Task DeleteAsync(Enrollment enrollment)
        {
            _context.Enrollments.Remove(enrollment);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(Guid userId, Guid courseId)
        {
            return await _context.Enrollments
                .AnyAsync(e => e.UserId == userId && e.CourseId == courseId);
        }
    }
}