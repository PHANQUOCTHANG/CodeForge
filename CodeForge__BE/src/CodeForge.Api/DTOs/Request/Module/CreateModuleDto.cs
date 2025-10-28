namespace CodeForge.Api.DTOs
{
    public class CreateModuleDto
    {

        public Guid CourseId { get; set; }

        public string Title { get; set; } = string.Empty;
    }
}