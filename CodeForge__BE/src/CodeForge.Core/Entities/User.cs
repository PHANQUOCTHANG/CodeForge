using System;
using System.Collections.Generic;

namespace CodeForge.Core.Entities
{
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

        public User() { }

        public User(string username, string email, string passwordHash, string role = "student", DateTime? joinDate = null, string status = "active")
        {
            Username = username;
            Email = email;
            PasswordHash = passwordHash;
            Role = role;
            JoinDate = joinDate ?? DateTime.UtcNow;
            Status = status;
        }
    }
}
