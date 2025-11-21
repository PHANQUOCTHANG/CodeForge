namespace CodeForge.Api.DTOs.Response
{
    public class CourseReviewDto
    {
        public Guid ReviewId { get; set; }
        public Guid CourseId { get; set; }

        // ✅ FIX: Thay thế UserId và Username bằng đối tượng UserSummaryDto
        public UserSummaryDto User { get; set; } = null!;
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; } // Giả định bạn đã thêm UpdatedAt vào DTO

    }
}
