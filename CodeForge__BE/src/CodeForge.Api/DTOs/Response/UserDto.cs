using CodeForge.Core.Entities;

namespace CodeForge.Api.DTOs.Response
{
        public class UserDto
        {
                public Guid UserId { get; set; }
                public string Username { get; set; } = string.Empty;
                public string Email { get; set; } = string.Empty;
                public string Role { get; set; } = string.Empty;
                public string Status { get; set; } = string.Empty;
                public DateTime JoinDate { get; set; }
                
                // Thông tin từ bảng Profile
                public string? FullName { get; set; }
                public string? Avatar { get; set; }
        }
}