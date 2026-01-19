using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodeForge.Core.Entities
{
    [Table("ResetTokens")]
    public class ResetToken
    {
        [Key]
        public Guid ResetTokenId { get; set; } = Guid.NewGuid();

        [Required, MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required, MaxLength(255)]
        public string Token { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Reset token expires after 30 minutes
        public DateTime ExpiresAt { get; set; }

        public bool IsUsed { get; set; } = false;

        public DateTime? UsedAt { get; set; }

        public ResetToken() { }

        public ResetToken(string email, string token)
        {
            Email = email;
            Token = token;
            CreatedAt = DateTime.UtcNow;
            ExpiresAt = DateTime.UtcNow.AddMinutes(30); // Reset token hết hạn sau 30 phút
        }

        // Kiểm tra xem Reset Token có còn hợp lệ không
        public bool IsValid()
        {
            return !IsUsed && DateTime.UtcNow < ExpiresAt;
        }
    }
}
