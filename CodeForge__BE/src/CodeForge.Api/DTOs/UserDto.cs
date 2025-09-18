namespace CodeForge.Api.DTOs
{
    public class UserDto
    {
        public string Username { get; set; } = string.Empty; // unique
        public string Email { get; set; } = string.Empty;    // unique
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "student";        // mặc định 'student'
        public DateTime JoinDate { get; set; } = DateTime.UtcNow; // mặc định SYSUTCDATETIME()
        public string Status { get; set; } = "active";   
        
            // mặc định 'active'
    }
}

