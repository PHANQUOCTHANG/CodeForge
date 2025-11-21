using System.ComponentModel.DataAnnotations;

namespace CodeForge.Api.DTOs
{
    public class UpdateLessonDto
    {
        public Guid? LessonId { get; set; } // Nullable: Nếu null -> Tạo mới
        public string Title { get; set; } = string.Empty;
        public string LessonType { get; set; } = string.Empty;
        public int OrderIndex { get; set; }
        public int Duration { get; set; }
        public bool IsDeleted { get; set; } = false;
        // Nội dung (Chỉ cần cập nhật nếu có thay đổi)
        public UpdateLessonVideoDto? VideoContent { get; set; }
        public UpdateLessonTextDto? TextContent { get; set; }
        public UpdateLessonQuizDto? QuizContent { get; set; }
        public UpdateCodingProblemDto? CodingProblem { get; set; }
    }
    public class UpdateLessonVideoDto
    {
        public string VideoUrl { get; set; } = string.Empty;
        public string? Caption { get; set; }
    }
    // ... (Tự định nghĩa tương tự cho Text, Quiz, Coding)
    public class UpdateLessonTextDto { public string Content { get; set; } = string.Empty; }
    public class UpdateLessonQuizDto
    {
        [Required]
        public string Title { get; set; }
        public string? Description { get; set; }
        public List<UpdateQuizQuestionDto> Questions { get; set; } = new();
    }
    public class UpdateQuizQuestionDto
    {
        public Guid? QuestionId { get; set; }
        [Required]
        public string Question { get; set; }
        public List<string> Answers { get; set; }
        public int CorrectIndex { get; set; }
    }
    public class UpdateCodingProblemDto
    {// (Bao gồm các trường của CodingProblem: Title, Description, Difficulty,...)
        [Required]
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Difficulty { get; set; } = "Easy";
        // ... (Bạn tự định nghĩa các trường cần thiết cho CodingProblem)}
    }

}