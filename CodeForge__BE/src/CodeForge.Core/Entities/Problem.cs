using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodeForge.Core.Entities
{
    [Table("CodingProblems")]
    public class Problem
    {
        [Key]
        [Column("ProblemID")]
        public Guid ProblemId { get; set; }

        [Column("LessonID")]
        public Guid LessonId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Difficulty { get; set; } = string.Empty; // easy, medium, hard

        public string Tags { get; set; } = string.Empty; // "array, dp, graph"

        public int TimeLimit { get; set; } = 1000; // ms
        public int MemoryLimit { get; set; } = 256; // MB

        public bool IsDeleted { get; set; } = false;

        // Navigation property
        [ForeignKey(nameof(LessonId))]
        public Lesson? Lesson { get; set; }

        public Problem() { }
    }
}
