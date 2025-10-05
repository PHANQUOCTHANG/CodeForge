using CodeForge.Api.DTOs;
using CodeForge.Api.DTOs.Request.Auth;

namespace CodeForge.Core.Interfaces.Services
{
    public interface IAuthService
    {
        Task<ApiResponse<AuthDto>> Login(LoginDto loginDto);
        Task<ApiResponse<AuthDto>> Register(RegisterDto registerDto);
    }
}