namespace CodeForge.Api.DTOs.Response
{
    public class CourseReviewDto
    {
        public Guid ReviewId { get; set; }
        public Guid UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
