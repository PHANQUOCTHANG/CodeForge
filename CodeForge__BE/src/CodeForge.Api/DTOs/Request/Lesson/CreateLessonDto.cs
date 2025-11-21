using System.ComponentModel.DataAnnotations;

namespace CodeForge.Application.DTOs.Lessons
{
    public class CreateLessonDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string LessonType { get; set; } = string.Empty; // "video", "text", "quiz", "coding"

        public int OrderIndex { get; set; }
        public int Duration { get; set; } // Tính bằng giây

        // Dữ liệu nội dung chi tiết (chỉ 1 trong các DTO này có giá trị)
        public CreateLessonVideoDto? VideoContent { get; set; }
        public CreateLessonTextDto? TextContent { get; set; }
        public CreateLessonQuizDto? QuizContent { get; set; }
        public CreateCodingProblemDto? CodingProblem { get; set; } // Giả sử CodingProblem DTO
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

    public class CreateCodingProblemDto
    {
        // (Bao gồm các trường của CodingProblem: Title, Description, Difficulty,...)
        [Required]
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Difficulty { get; set; } = "Easy";
        // ... (Bạn tự định nghĩa các trường cần thiết cho CodingProblem)
    }

    public class CreateLessonQuizDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public List<CreateQuizQuestionDto> Questions { get; set; } = new List<CreateQuizQuestionDto>();
    }

    public class CreateQuizQuestionDto
    {
        [Required]
        public string Question { get; set; } = string.Empty;

        [Required]
        public List<string> Answers { get; set; } = new List<string>(); // JSON: ["A", "B", "C"]

        [Required]
        public int CorrectIndex { get; set; }
    }
}