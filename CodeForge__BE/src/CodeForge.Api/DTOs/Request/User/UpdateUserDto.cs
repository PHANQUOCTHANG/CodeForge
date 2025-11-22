namespace CodeForge.Api.DTOs.Request.User
{
    public class UpdateUserDto
    {
        public string? FullName { get; set; } // Update vào bảng Profile
        public string? Role { get; set; }
        public string? Status { get; set; } // active, banned...
    }
}