using System.ComponentModel.DataAnnotations;

namespace CodeForge.Api.DTOs.Request.Language
{
    public class UpdateLanguageDto
    {
        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? Version { get; set; }
    }
}