using CodeForge.Api.DTOs;
using CodeForge.Api.DTOs.Response;

namespace CodeForge.Api.DTOs.Response;

public class CourseDetailDto
{
    public Guid CourseId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public string? Thumbnail { get; set; } = string.Empty;
    public string? Overview { get; set; } = string.Empty;
    public string Level { get; set; } = string.Empty;
    public string Language { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal Discount { get; set; }
    public int Duration { get; set; }
    public double Rating { get; set; }
    public int TotalRatings { get; set; }
    public int TotalStudents { get; set; }
    public int LessonCount { get; set; } = 0;     // tổng số học viên
    public string CategoryName { get; set; } = string.Empty;
    public string CategoryId { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public bool IsEnrolled { get; set; } = false; // chỉ hiển thị nếu user đăng nhập
    public double Progress { get; set; } = 0; // %
    public string Status { get; set; } = string.Empty;
    public List<ModuleDto> Modules { get; set; } = new();
    public List<CourseReviewDto> Reviews { get; set; } = new();

}


