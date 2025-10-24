using CodeForge.Core.Entities;

namespace CodeForge.Core.Interfaces.Services
{
    public interface ITokenService
    {
        string GenerateAccessToken(User user);
        string GenerateRefreshToken(); // returns raw token
        string HashToken(string token); // SHA256
    }
}
