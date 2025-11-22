using System.ComponentModel.DataAnnotations;

namespace CodeForge.Api.DTOs.Request.Language
{
    public class CreateLanguageDto
    {
        [Required(ErrorMessage = "Tên ngôn ngữ không được để trống")]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? Version { get; set; }
    }
}