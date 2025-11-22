using CodeForge.Api.DTOs.Statistics;

using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace CodeForge.Infrastructure.Repositories
{
    public class StatisticsRepository : IStatisticsRepository
    {
        private readonly ApplicationDbContext _context;

        public StatisticsRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardStatsDto> GetDashboardStatsAsync()
        {
            var stats = new DashboardStatsDto();
            var now = DateTime.UtcNow;
            var sixMonthsAgo = now.AddMonths(-6);

            // 1. Summary Cards
            // Đếm sinh viên (loại trừ admin/teacher nếu cần)
            stats.Summary.TotalStudents = await _context.Users
                .CountAsync(u => u.Role == "student" && !u.IsDeleted);
            
            stats.Summary.TotalCourses = await _context.Courses
                .CountAsync(c => c.Status == "active" && !c.IsDeleted);

            // Tính tổng doanh thu từ bảng Payments (chỉ lấy giao dịch thành công)
            // Giả sử status thành công là 'succeeded' hoặc 'completed'
            stats.Summary.TotalRevenue = await _context.Payments
                .Where(p => p.Status == "succeeded")
                .SumAsync(p => p.Amount);

            stats.Summary.TotalSubmissions = await _context.Submissions.CountAsync();

            // 2. Revenue Chart (Theo tháng - 6 tháng gần nhất)
            var revenueData = await _context.Payments
                .Where(p => p.Status == "succeeded"  && p.CreatedAt >= sixMonthsAgo)
                .GroupBy(p => new { p.CreatedAt.Year, p.CreatedAt.Month })
                .Select(g => new 
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Total = g.Sum(x => x.Amount)
                })
                .OrderBy(x => x.Year).ThenBy(x => x.Month)
                .ToListAsync();

            stats.RevenueChart = revenueData.Select(x => new RevenueChartDto
            {
                Date = $"{x.Month}/{x.Year}",
                Amount = x.Total
            }).ToList();

            // 3. New Users Chart (Theo tháng - 6 tháng gần nhất)
            var userData = await _context.Users
                .Where(u => u.Role == "student" && !u.IsDeleted && u.JoinDate >= sixMonthsAgo)
                .GroupBy(u => new { u.JoinDate.Year, u.JoinDate.Month })
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Count = g.Count()
                })
                .OrderBy(x => x.Year).ThenBy(x => x.Month)
                .ToListAsync();

            stats.NewUserChart = userData.Select(x => new NewUserChartDto
            {
                Date = $"{x.Month}/{x.Year}",
                Count = x.Count
            }).ToList();

            // 4. Top Courses (Top 5 theo doanh thu)
            // Join Enrollments với Courses để lấy thông tin chi tiết
            // Hoặc Join Payments nếu muốn chính xác theo tiền
            stats.TopCourses = await _context.Courses
                .Where(c => !c.IsDeleted)
                .Select(c => new TopCourseDto
                {
                    CourseId = c.CourseId,
                    Title = c.Title,
                    Thumbnail = c.Thumbnail,
                    // Đếm số học viên từ bảng Enrollments
                    TotalStudents = _context.Enrollments.Count(e => e.CourseId == c.CourseId),
                    // Tính doanh thu từ bảng Payments (liên kết qua CourseID)
                    Revenue = _context.Payments
                        .Where(p => p.CourseId == c.CourseId && p.Status == "succeeded")
                        .Sum(p => p.Amount)
                })
                .OrderByDescending(x => x.Revenue)
                .Take(5)
                .ToListAsync();

            // 5. Submission Stats
            var subStats = await _context.Submissions
                .GroupBy(s => 1) // Group all
                .Select(g => new
                {
                    Total = g.Count(),
                    Solved = g.Count(x => x.Status == "Accepted" || x.Status == "SOLVED"),
                    Failed = g.Count(x => x.Status != "Accepted" && x.Status != "SOLVED")
                })
                .FirstOrDefaultAsync();

            if (subStats != null)
            {
                stats.SubmissionStats.Total = subStats.Total;
                stats.SubmissionStats.Solved = subStats.Solved;
                stats.SubmissionStats.Failed = subStats.Failed;
                stats.SubmissionStats.PassRate = subStats.Total > 0 
                    ? Math.Round((double)subStats.Solved / subStats.Total * 100, 2) 
                    : 0;
            }

            return stats;
        }
    }
}