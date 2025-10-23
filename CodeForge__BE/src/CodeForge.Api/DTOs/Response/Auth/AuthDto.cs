using System.Text.Json.Serialization;
using CodeForge.Api.DTOs.Response;

namespace CodeForge.Api.DTOs.Auth
{
    public class AuthDto
    {
        public string AccessToken { get; set; } = null!;
        [JsonIgnore] // ❌ Không bao giờ trả ra ngoài JSON
        public string? RefreshToken { get; set; } = null;
        // ✅ THÊM: Đối tượng DTO chứa thông tin người dùng
        public UserDto? UserInfo { get; set; }
    }
}