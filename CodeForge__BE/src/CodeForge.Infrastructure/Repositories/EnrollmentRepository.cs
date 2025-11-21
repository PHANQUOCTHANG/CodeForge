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
                // ✅ 1. Lọc theo UserID
                .Where(e => e.UserId == userId)

                // ✅ 2. LỌC THEO STATUS: Chỉ lấy những bản ghi đã "enrolled" (thành công)
                .Where(e => e.Status == "enrolled")

                // 3. Chọn ID khóa học
                .Select(e => e.CourseId)
                .ToListAsync();
        }
        // ✅ TRIỂN KHAI HÀM TÌM KIẾM PENDING
        public async Task<Enrollment?> GetPendingEnrollmentAsync(Guid userId, Guid courseId)
        {
            return await _context.Enrollments
                // ✅ Chỉ tìm những bản ghi có status là "pending"
                .FirstOrDefaultAsync(e =>
                    e.UserId == userId &&
                    e.CourseId == courseId &&
                    e.Status == "pending");
            // KHÔNG dùng AsNoTracking() nếu bạn muốn tái sử dụng đối tượng để cập nhật sau này.
        }
        public async Task UpdateAsync(Enrollment enrollment)
        {
            // Kiểm tra trạng thái: Nếu Entity chưa được theo dõi, chúng ta phải gắn nó vào và đánh dấu là Modified.
            if (_context.Entry(enrollment).State == EntityState.Detached)
            {
                // Thường không cần thiết nếu GetByUserIdAndCourseIdAsync không dùng AsNoTracking(), 
                // nhưng đây là cơ chế an toàn cho EF Core.
                _context.Enrollments.Update(enrollment);
            }

            // EF Core sẽ phát hiện rằng thuộc tính 'Status' đã thay đổi.
            await _context.SaveChangesAsync();
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