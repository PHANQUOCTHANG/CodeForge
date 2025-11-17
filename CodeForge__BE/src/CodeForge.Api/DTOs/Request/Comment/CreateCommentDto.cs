using System.ComponentModel.DataAnnotations;

namespace CodeForge.Api.DTOs.Request.Comment
{
    public class CreateCommentDto
    {
        [Required]
        public Guid ThreadID { get; set; }

        [Required]
        public Guid UserID { get; set; }

        [Required]
        [MaxLength(1000)]
        public string Content { get; set; }

        public Guid? ParentCommentID { get; set; }
    }
}