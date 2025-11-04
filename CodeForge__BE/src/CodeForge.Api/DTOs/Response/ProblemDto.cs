using System;

namespace CodeForge.Api.DTOs
{
        public class ProblemDto
        {
                public Guid ProblemId { get; set; }
                public Guid? LessonId { get; set; }
                public string Title { get; set; } = string.Empty;
                public string Slug { get; set; } = string.Empty;
                public string Description { get; set; } = string.Empty;
                public string Difficulty { get; set; } = string.Empty;
                public string? Tags { get; set; }
                public string? FunctionName { get; set; }
                public string? Parameters { get; set; }
                public string? ReturnType { get; set; }
                public string? Status { get; set; }
                public string? Constraints { get; set; }
                public string? Notes { get; set; }
                public int TimeLimit { get; set; }
                public int MemoryLimit { get; set; }
                public DateTime CreatedAt { get; set; }
                public DateTime UpdatedAt { get; set; }

                // Nếu muốn trả thông tin cơ bản của Lesson
                public LessonDto? Lesson { get; set; }
        }
}
