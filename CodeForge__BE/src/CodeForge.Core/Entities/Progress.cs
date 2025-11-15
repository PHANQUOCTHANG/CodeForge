using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodeForge.Core.Entities
{
    [Table("Progress")]
    public class Progress
    {
        [Key]
        public Guid ProgressId { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }

        [Required]
        public Guid LessonId { get; set; }

        [Required, MaxLength(20)]
        public string Status { get; set; } = "in_progress"; // in_progress | completed

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // 🔗 Navigation
        public virtual User User { get; set; } = null!;
        public virtual Lesson Lesson { get; set; } = null!;

    }
}
