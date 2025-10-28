namespace CodeForge.Core.Entities
{
    public class LessonQuizze
    {
        public Guid QuizId { get; set; }
        public Guid LessonId { get; set; }
        public string Title { get; set; } = string.Empty;

        // Navigation
        public Lesson Lesson { get; set; } = null!;
        public ICollection<QuizQuestion> Questions { get; set; } = new List<QuizQuestion>();
    }
}
