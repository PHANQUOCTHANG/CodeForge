using System.ComponentModel.DataAnnotations;

namespace CodeForge.Api.DTOs.Request.Comment
{
    public class UpdateCommentDto
    {
        [Required]
        [MaxLength(1000)]
        public string Content { get; set; }
    }
}