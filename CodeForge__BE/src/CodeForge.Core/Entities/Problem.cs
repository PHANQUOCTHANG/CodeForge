using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodeForge.Core.Entities
{
        [Table("CodingProblems")]
        public class Problem
        {
                [Key]
                [Column("ProblemID")]
                public Guid ProblemId { get; set; } = Guid.NewGuid();

                public Guid? LessonId { get; set; }

                [Required, MaxLength(200)]
                public string? Title { get; set; }

                [Required, MaxLength(200)]
                public string? Slug { get; set; }

                public string? Description { get; set; }

                [Required, MaxLength(20)]
                public string? Difficulty { get; set; } = "Dễ";

                [MaxLength(255)]
                public string? Tags { get; set; }

                [MaxLength(100)]
                public string? FunctionName { get; set; }

                [MaxLength(500)]
                public string? Parameters { get; set; }

                [MaxLength(100)]
                public string? ReturnType { get; set; }

                public string? Status { get; set; } = "NOT_STARTED";

                public int TimeLimit { get; set; } = 1000;

                public int MemoryLimit { get; set; } = 256;

                public string? Notes { get; set; }

                public string? Constraints { get; set; }

                public DateTime CreatedAt { get; set; } = DateTime.Now;

                public DateTime UpdatedAt { get; set; } = DateTime.Now;

                public bool IsDeleted { get; set; } = false;

                // ---------------- 🔗 Navigation Property ----------------
                [ForeignKey("LessonId")]
                public Lesson? Lesson { get; set; }

                public Problem() { }
        }
}
