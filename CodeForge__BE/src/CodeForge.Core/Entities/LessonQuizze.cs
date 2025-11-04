using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodeForge.Core.Entities
{
    [Table("LessonQuizzes")]
    public class LessonQuiz
    {
        [Key, ForeignKey("Lesson")] // PK đồng thời là FK
        public Guid LessonId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        // Quan hệ 1–1 với Lesson
        [ForeignKey(nameof(LessonId))]
        public Lesson Lesson { get; set; } = null!;

        // ✅ Quan hệ 1-n với QuizQuestion
        public ICollection<QuizQuestion> Questions { get; set; } = new List<QuizQuestion>();
    }
}
