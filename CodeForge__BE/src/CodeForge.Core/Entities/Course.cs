using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodeForge.Core.Entities
{
    public class Course
    {
        [Key]
        public Guid CourseId { get; set; } = Guid.NewGuid();  // tương ứng CourseID UNIQUEIDENTIFIER DEFAULT NEWID()

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        [MaxLength(20)]
        public string Level { get; set; } = "Beginner"; // "Beginner","Intermediate","Advanced"

        [Required]
        [MaxLength(50)]
        public string Language { get; set; } = string.Empty;

        [Required]
        public Guid CreatedBy { get; set; }   // FK -> Users.UserID

        [ForeignKey("CreatedBy")]
        public User User { get; set; } = null!;   // navigation property

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "draft"; // mặc định "draft"

        public bool IsDeleted { get; set; } = false;
        public Course()
        {

        }
        public Course(string title, string? description, string language, string level, Guid createdBy, User user, DateTime createdAt, string status, bool isDeleted)
        {
            CourseId = Guid.NewGuid();
            Title = title;
            Description = description;
            Language = language;
            Level = level;
            CreatedBy = createdBy;
            User = user;
            CreatedAt = createdAt;
            Status = status;
            IsDeleted = isDeleted;
        }

    }
}