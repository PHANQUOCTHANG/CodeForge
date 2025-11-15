using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodeForge.Core.Entities
{
    [Table("LessonTexts")]
    public class LessonText
    {
        [Key, ForeignKey("Lesson")] // PK đồng thời là FK
        public Guid LessonId { get; set; }

        [Required]
        public string Content { get; set; } = string.Empty;

        // 🔗 Quan hệ 1-1
        public Lesson Lesson { get; set; } = null!;
    }
}
