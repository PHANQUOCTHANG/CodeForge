using System.ComponentModel.DataAnnotations;
using CodeForge.Application.DTOs.Lessons;

namespace CodeForge.Application.DTOs.Modules
{
    public class CreateModuleDto
    {
        [Required]
        public Guid CourseId { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public int OrderIndex { get; set; }

        // Danh sách các Lesson
        public List<CreateLessonDto> Lessons { get; set; } = new List<CreateLessonDto>();
    }
}