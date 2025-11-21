using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodeForge.Core.Entities
{
    [Table("Profiles")]
    public class Profile
    {
        [Key]
        public Guid ProfileID { get; set; } = Guid.NewGuid();

        [Required]
        [ForeignKey("User")]
        [Column("UserID")]
        public Guid UserID { get; set; }  // FK → Users

        [MaxLength(100)]
        public string? FullName { get; set; }

        [MaxLength(255)]
        public string? Avatar { get; set; }

        [MaxLength(500)]
        public string? Bio { get; set; }

        [MaxLength(100)]
        public string? Country { get; set; }

        public int Points { get; set; } = 0;

        public int Level { get; set; } = 1;

        public bool IsDeleted { get; set; } = false;

        // ==========================
        // Navigation Property
        // ==========================
        [ForeignKey(nameof(UserID))]
        public User? User { get; set; }
    }
}
