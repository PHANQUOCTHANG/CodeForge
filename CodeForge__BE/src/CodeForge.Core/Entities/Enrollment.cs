using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodeForge.Core.Entities
{
    [Table("Enrollments")]
    public class Enrollment
    {
        [Key]
        public Guid EnrollmentId { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }

        [Required]
        public Guid CourseId { get; set; }

        [Required, MaxLength(20)]
        public string Status { get; set; } = "enrolled"; // enrolled | completed | cancelled

        public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;

        // 🔗 Navigation
        public virtual User User { get; set; } = null!;
        public virtual Course Course { get; set; } = null!;
    }
}
