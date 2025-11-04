using System.ComponentModel.DataAnnotations;

namespace CodeForge.Api.DTOs
{
    public class UpdateProgressRequestDto
    {
        [Required]
        public Guid LessonId { get; set; }

        [Required]
        public string Status { get; set; } = string.Empty; // "completed" hoặc "in_progress"
    }
}