using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodeForge.Core.Entities
{
    [Table("Users")]
    public class User
    {
        public Guid UserId { get; set; } = Guid.NewGuid();   // PK, sinh bằng Guid.NewGuid() hoặc NEWID() trong SQL
        public string Username { get; set; } = string.Empty; // unique
        public string Email { get; set; } = string.Empty;    // unique
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "student";        // mặc định 'student'
        public DateTime JoinDate { get; set; } = DateTime.UtcNow; // mặc định SYSUTCDATETIME()
        public string Status { get; set; } = "active";       // mặc định 'active'

        // 🔹 Trường soft delete
        public bool IsDeleted { get; set; } = false;
        public ICollection<CourseReview> CourseReviews { get; set; } = new List<CourseReview>();
        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
        public User() { }

    }
}
