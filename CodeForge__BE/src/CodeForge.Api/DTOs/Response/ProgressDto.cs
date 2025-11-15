
namespace CodeForge.Application.DTOs.Response
{
    /// <summary>
    /// DTO trả về thông tin của một bản ghi tiến độ.
    /// </summary>
    public class ProgressDto
    {
        public Guid ProgressId { get; set; }
        public Guid UserId { get; set; }
        public Guid LessonId { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime UpdatedAt { get; set; }
    }
}