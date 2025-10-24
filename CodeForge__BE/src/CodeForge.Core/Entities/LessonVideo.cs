namespace CodeForge.Core.Entities
{
    public class LessonVideo
    {
        public Guid LessonVideoId { get; set; }
        public Guid LessonId { get; set; }

        public string VideoUrl { get; set; } = string.Empty;
        public TimeSpan Duration { get; set; }

        public Lesson Lesson { get; set; } = null!;
    }
}
