namespace CodeForge.Api.DTOs.Request.User
{
    public class UserDto
    {
        public Guid UserId { get; set; }
        public string Username { get; set; } 
        public string Email { get; set; } 
        public string Role { get; set; } 
        public DateTime JoinDate { get; set; } 
        public string Status { get; set; }
        public bool IsDeleted { get; set; }
    }
}