namespace CodeForge.Api.DTOs
{
    public class UpdateModuleDto
    {

        public Guid ModuleId { get; set; }
        public Guid CourseId { get; set; }

        public string Title { get; set; }
        public int OrderIndex { get; set; }
    }
}