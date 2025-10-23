using CodeForge.Core.Entities;

namespace CodeForge.Api.DTOs.Response
{
    public class UserDto
    {
        public Guid UserId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public string Status { get; set; }
        public bool IsDeleted { get; set; } = false;
        // // 🔗 Navigation
        // public virtual Profile? Profile { get; set; }
        // public virtual ICollection<Course>? Courses { get; set; }
    }
}