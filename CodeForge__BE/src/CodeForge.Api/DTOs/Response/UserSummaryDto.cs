using CodeForge.Core.Entities;

namespace CodeForge.Api.DTOs.Response
{
    public class UserSummaryDto
    {
        public Guid UserId { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? Role { get; set; }
        public DateTime JoinDate { get; set; }
    }
}