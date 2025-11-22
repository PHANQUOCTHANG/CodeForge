
using System.ComponentModel.DataAnnotations;

namespace CodeForge.Application.DTOs.Request.CourseCategory

{
    public class UpdateCategoryDto
    {
        public Guid CategoryId { get; set; }
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Icon { get; set; }
    }
}
