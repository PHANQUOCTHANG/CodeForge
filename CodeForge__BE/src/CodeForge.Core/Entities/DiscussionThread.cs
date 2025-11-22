using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodeForge.Core.Entities
{
    [Table("DiscussionThreads")]
    public class DiscussionThread
    {
        [Key]
        public Guid ThreadID { get; set; } 

        [Required]
        [ForeignKey("User")]
        [Column("UserID")]
        public Guid UserID { get; set; }

        [Required]
        [MaxLength(255)]
        public string Title { get; set; }

        [Required]
        public string Content { get; set; }

        public string? ImageUrl { get; set; }
        public string? Tags { get; set; }
        
        public int Likes { get; set; } = 0;
        public int Shares { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public bool IsDeleted { get; set; } = false;

        public virtual User? User { get; set; }
        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}