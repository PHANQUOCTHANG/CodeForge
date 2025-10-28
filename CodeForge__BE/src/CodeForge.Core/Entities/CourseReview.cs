using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodeForge.Core.Entities
{
    [Table("CourseReviews")]
    public class CourseReview
    {
        [Key]
        public Guid ReviewId { get; set; }
        public Guid CourseId { get; set; }
        public Guid UserId { get; set; }

        public int Rating { get; set; }

        public string? Comment { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public Course Course { get; set; } = null!;
        public User User { get; set; } = null!;
    }
}
