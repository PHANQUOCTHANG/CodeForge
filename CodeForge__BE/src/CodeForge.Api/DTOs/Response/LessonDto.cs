using System.Reflection;

namespace CodeForge.Api.DTOs
{
    public class LessonDto {
        public Guid LessonId { get; set; } 

        public Guid ModuleId { get; set; }
        public string Title { get; set; }

        public string? Content { get; set; }

        public string LessonType { get; set; } 

        public int OrderIndex { get; set; }

        public bool IsDeleted { get; set; } 

        // Navigation property
        public Module? Module { get; set; }
    }
}