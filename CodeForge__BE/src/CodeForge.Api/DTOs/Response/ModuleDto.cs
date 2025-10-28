using CodeForge.Core.Entities;

namespace CodeForge.Api.DTOs
{
    public class ModuleDto
    {
        public Guid ModuleId { get; set; }
        public Guid CourseId { get; set; }
        public string Title { get; set; } = string.Empty;
        public int OrderIndex { get; set; }
        public bool IsDeleted { get; set; }
        public List<LessonDto> Lessons { get; set; } = new();
    }
}