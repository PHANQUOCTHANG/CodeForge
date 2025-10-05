using CodeForge.Core.Entities;

namespace CodeForge.Api.DTOs
{
    public class ModuleDto
    {
        public Guid ModuleId { get; set; }
        public Guid CourseId { get; set; }
        public string Title { get; set; }
        public int OrderIndex { get; set; }
        public bool IsDeleted { get; set; }
        public Course? Course { get; set; }

    }
}