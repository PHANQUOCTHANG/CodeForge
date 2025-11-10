using System.ComponentModel.DataAnnotations;

namespace CodeForge.Application.DTOs.Modules
{
    public class UpdateModuleDto
    {
        [Required]
        public Guid ModuleId { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public int OrderIndex { get; set; }
    }
}