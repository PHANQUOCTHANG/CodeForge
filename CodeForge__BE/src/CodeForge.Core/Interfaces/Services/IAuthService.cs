using CodeForge.Api.DTOs;
using CodeForge.Api.DTOs.Auth;
using CodeForge.Api.DTOs.Request.Auth;

namespace CodeForge.Core.Interfaces.Services
{
    public interface IAuthService
    {
        Task<AuthDto> RegisterAsync(RegisterDto request, string ipAddress);
        Task<AuthDto> LoginAsync(LoginDto request, string ipAddress);
        Task<AuthDto> RefreshTokenAsync(string refreshToken, string ipAddress);
        Task RevokeTokenAsync(string refreshToken, string ipAddress);


    }
}