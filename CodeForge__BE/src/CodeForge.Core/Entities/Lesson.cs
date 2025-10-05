using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodeForge.Core.Entities
{
    public class Lesson
    {
      
        [Key]
        public Guid LessonId { get; set; } = Guid.NewGuid();

        [Required]
        public Guid ModuleId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        public string? Content { get; set; }

        [Required]
        [MaxLength(20)]
        public string LessonType { get; set; } = string.Empty; // video, text, quiz, coding

        public int OrderIndex { get; set; }

        public bool IsDeleted { get; set; } = false;

        // Navigation property
        [ForeignKey(nameof(ModuleId))]
        public Module? Module { get; set; }
    }
}