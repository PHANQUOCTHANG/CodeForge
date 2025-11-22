using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CodeForge.Infrastructure.Repositories
{
    public class CourseReviewRepository : ICourseReviewRepository
    {
        private readonly ApplicationDbContext _context;

        public CourseReviewRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // =======================================================
        // CÁC PHƯƠNG THỨC GHI (WRITE OPERATIONS)
        // =======================================================

        // 🟢 Thêm đánh giá mới
        public async Task<CourseReview> AddAsync(CourseReview review)
        {
            await _context.CourseReviews.AddAsync(review);
            await SaveChangesAsync();
            return review;
        }

        // 🟡 Cập nhật đánh giá
        // Giả định đối tượng 'review' được truyền vào đã được tải (tracked) hoặc đã được ánh xạ DTO
        public async Task<CourseReview?> UpdateAsync(CourseReview review)
        {
            // Nếu Entity đã được Service tải về có theo dõi (tracking), chỉ cần gọi SaveChanges
            if (_context.Entry(review).State == EntityState.Detached)
            {
                // Nếu đối tượng là Detached (không được theo dõi), attach nó và đánh dấu là Modified
                _context.CourseReviews.Update(review);
            }

            await SaveChangesAsync();
            return review;
        }

        // 🔴 Xóa đánh giá (theo ID)
        public async Task<bool> DeleteAsync(Guid reviewId)
        {
            // Tìm đánh giá cần xóa (không cần .AsNoTracking() vì ta cần xóa)
            var reviewToDelete = await _context.CourseReviews.FirstOrDefaultAsync(r => r.ReviewId == reviewId);

            if (reviewToDelete == null)
            {
                return false; // Không tìm thấy để xóa
            }

            _context.CourseReviews.Remove(reviewToDelete);
            int affectedRows = await _context.SaveChangesAsync();

            return affectedRows > 0;
        }

        // 💾 Lưu thay đổi (Phương thức dùng nội bộ và được ICourseReviewRepository yêu cầu)
        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();


        // =======================================================
        // CÁC PHƯƠNG THỨC ĐỌC (READ OPERATIONS)
        // =======================================================

        // 🔎 Lấy đánh giá của một người dùng cho một khóa học (Dùng cho kiểm tra Conflict)
        public async Task<CourseReview?> GetReviewByUserAndCourseAsync(Guid userId, Guid courseId)
        {
            return await _context.CourseReviews
                .AsNoTracking() // ✅ Tối ưu hóa: Chỉ đọc
                .FirstOrDefaultAsync(r => r.UserId == userId && r.CourseId == courseId);
        }

        // 📚 Lấy tất cả đánh giá cho một khóa học (Dùng cho hiển thị công khai)
        public async Task<List<CourseReview>> GetReviewsByCourseIdAsync(Guid courseId)
        {
            return await _context.CourseReviews
                .Where(r => r.CourseId == courseId)
                .Include(r => r.User) // ✅ BẮT BUỘC: Tải thông tin người dùng để ánh xạ ReviewDto
                .AsNoTracking()       // ✅ Tối ưu hóa: Chỉ đọc
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        // 🔍 Lấy đánh giá theo ID (Cần thiết cho UpdateService, cần Tracking)
        public async Task<CourseReview?> GetByIdAsync(Guid reviewId)
        {
            return await _context.CourseReviews
                // KHÔNG dùng AsNoTracking() vì Service cần theo dõi để Update
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.ReviewId == reviewId);
        }
    }
}