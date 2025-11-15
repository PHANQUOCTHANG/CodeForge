using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodeForge.Core.Entities
{
        [Table("Lessons")]
        public class Lesson
        {
                [Key]
                public Guid LessonId { get; set; } = Guid.NewGuid();

                [Required]
                public Guid ModuleId { get; set; }

                [Required, MaxLength(200)]
                public string Title { get; set; } = string.Empty;

                [Required, MaxLength(20)]
                public string LessonType { get; set; } = string.Empty; // video | text | quiz | coding

                public int OrderIndex { get; set; }

                public int Duration { get; set; } = 0;

                public bool IsDeleted { get; set; } = false;

                // 🔗 Navigation
                [ForeignKey(nameof(ModuleId))]
                public Module Module { get; set; } = null!;

                // 1-1 Quan hệ
                public LessonText? LessonText { get; set; }
                public LessonVideo? LessonVideo { get; set; }
                public LessonQuiz? LessonQuiz { get; set; }
                public Problem? CodingProblem { get; set; }

                // 1-n
                public ICollection<Progress> Progresses { get; set; } = new List<Progress>();
        }
}
