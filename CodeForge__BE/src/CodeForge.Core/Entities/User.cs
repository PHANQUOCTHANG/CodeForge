using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodeForge.Core.Entities
{
        [Table("Users")]
        public class User
        {
                [Key]
                public Guid UserId { get; set; } = Guid.NewGuid();

                [Required, MaxLength(50)]
                public string Username { get; set; } = string.Empty;

                [Required, MaxLength(100)]
                public string Email { get; set; } = string.Empty;

                [Required, MaxLength(255)]
                public string PasswordHash { get; set; } = string.Empty;

                [Required, MaxLength(20)]
                public string Role { get; set; } = "student"; // student | teacher | admin

                public DateTime JoinDate { get; set; } = DateTime.UtcNow;

                [Required, MaxLength(20)]
                public string Status { get; set; } = "active"; // active | banned

                public bool IsDeleted { get; set; } = false;
                public ICollection<CourseReview> CourseReviews { get; set; } = new List<CourseReview>();
                public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
                public User() { }

        }
}
