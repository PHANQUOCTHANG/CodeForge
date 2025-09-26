using CodeForge.Api.DTOs;
using CodeForge.Api.DTOs.Request.Auth;

namespace CodeForge.Core.Interfaces.Services
{
    public interface IAuthService
    {
        Task<AuthDto> Login(LoginDto loginDto);
        Task<AuthDto> Register(RegisterDto registerDto);
    }
}