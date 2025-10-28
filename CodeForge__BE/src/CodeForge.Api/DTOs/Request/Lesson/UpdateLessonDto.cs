namespace CodeForge.Api.DTOs
{
    public class UpdateLessonDto
    {
        public Guid LessonId { get; set; } = Guid.NewGuid();

        public Guid ModuleId { get; set; }
        public string Title { get; set; }

        public string Content { get; set; }
        public string LessonType { get; set; }

        public int OrderIndex { get; set; }
    }
}