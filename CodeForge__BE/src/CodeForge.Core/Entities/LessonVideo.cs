using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodeForge.Core.Entities
{
    public class LessonVideo
    {
        [Key, ForeignKey("Lesson")] // PK đồng thời là FK
        public Guid LessonId { get; set; }

        public string VideoUrl { get; set; } = string.Empty;
        public int Duration { get; set; }

        public Lesson Lesson { get; set; } = null!;
    }
}
