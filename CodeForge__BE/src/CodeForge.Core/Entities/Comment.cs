using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodeForge.Core.Entities
{
    [Table("Comments")]
    public class Comment
    {
        [Key]
        public Guid CommentID { get; set; } = Guid.NewGuid();

        [Required]
        [ForeignKey("DiscussionThread")]
        public Guid ThreadID { get; set; }  // FK đến DiscussionThread

        [Required]
        [ForeignKey("User")]
        public Guid UserId { get; set; }  // FK đến User

        [Required]
        public string Content { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("ParentComment")]
        public Guid? ParentCommentID { get; set; }  // Comment reply

        public bool IsDeleted { get; set; } = false;

        public virtual DiscussionThread? Thread { get; set; }
        public virtual User? User { get; set; }
        public virtual Comment? ParentComment { get; set; }
        public virtual ICollection<Comment> Replies { get; set; } = new List<Comment>();
    }
}
