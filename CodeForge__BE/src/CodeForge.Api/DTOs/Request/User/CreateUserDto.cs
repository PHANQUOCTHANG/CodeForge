namespace CodeForge.Api.DTOs.Request.User
{
    public class CreateUserDto
    {
        public string Username { get; set; } 
        public string Email { get; set; } 
        public string PasswordHash { get; set; } 
        public string Role { get; set; } = "student"; 
    }
}