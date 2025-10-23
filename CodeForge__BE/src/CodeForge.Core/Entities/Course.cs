
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodeForge.Core.Entities
{
    public class Course
    {
        [Key]
        public Guid CourseId { get; set; } = Guid.NewGuid();

        [Required, MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required, MaxLength(20)]
        public string Level { get; set; } = "beginner"; // beginner, intermediate, advanced

        [Required, MaxLength(50)]
        public string Language { get; set; } = string.Empty;

        [Required]
        public Guid CreatedBy { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required, MaxLength(20)]
        public string Status { get; set; } = "active";

        public bool IsDeleted { get; set; } = false;

        // 🔗 Navigation
        [ForeignKey("CreatedBy")]
        public User? Creator { get; set; }

        // public virtual ICollection<Module>? Modules { get; set; }

        public Course () {}
    }
}
