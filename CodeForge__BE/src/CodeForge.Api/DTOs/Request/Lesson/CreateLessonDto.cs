using System.ComponentModel.DataAnnotations;

namespace CodeForge.Application.DTOs.Lessons
{
    public class CreateLessonDto
    {
        [Required]
        public Guid ModuleId { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string LessonType { get; set; } = string.Empty; // video, text, quiz, coding

        [Required]
        public int OrderIndex { get; set; }

        public int Duration { get; set; } = 0;

        // Dữ liệu cho từng loại bài học (client chỉ gửi 1)
        public CreateLessonVideoDto? VideoContent { get; set; }
        public CreateLessonTextDto? TextContent { get; set; }
        // ... (Tương tự cho Quiz và CodingProblem)
    }

    public class CreateLessonVideoDto
    {
        [Required]
        public string VideoUrl { get; set; } = string.Empty;
        public string? Caption { get; set; }
    }

    public class CreateLessonTextDto
    {
        [Required]
        public string Content { get; set; } = string.Empty;
    }
}