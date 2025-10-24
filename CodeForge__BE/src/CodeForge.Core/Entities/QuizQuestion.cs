namespace CodeForge.Core.Entities
{
    public class QuizQuestion
    {
        public Guid QuizQuestionId { get; set; }
        public Guid QuizId { get; set; }

        public string Question { get; set; } = string.Empty;
        public string[] Answers { get; set; } = Array.Empty<string>(); // serialized to JSON in DB
        public int CorrectAnswerIndex { get; set; }

        public LessonQuizze Quiz { get; set; } = null!;
    }
}
