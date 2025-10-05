namespace CodeForge.Api.DTOs
{
    public class CreateLessonDto
    {
        public Guid ModuleId { get; set; }
        public string Title { get; set; }

        public string Content { get; set; }
        public string LessonType { get; set; }
    }
}