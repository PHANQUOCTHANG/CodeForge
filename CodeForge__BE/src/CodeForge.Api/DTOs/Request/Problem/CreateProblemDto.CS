namespace CodeForge.Api.DTOs
{
    public class CreateProblemDto
    {
        public Guid LessonId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Difficulty { get; set; }
        public string Tags { get; set; }
        public int TimeLimit { get; set; }
        public int MemoryLimit { get; set; }
    }
}