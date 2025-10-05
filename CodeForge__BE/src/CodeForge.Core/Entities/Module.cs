using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Humanizer;

namespace CodeForge.Core.Entities
{
    public class Module
    {

        [Key]
        public Guid ModuleId { get; set; } = Guid.NewGuid();

        [Required]
        public Guid CourseId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        public int OrderIndex { get; set; }
        public bool IsDeleted { get; set; } = false;

        [ForeignKey(nameof(CourseId))]
        public Course? Course { get; set; }
    }
}