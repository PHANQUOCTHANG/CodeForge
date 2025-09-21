
using CodeForge.Api.DTOs.Request.Auth;
using CodeForge.Core.Entities;

namespace CodeForge.Core.Interfaces.Repositories
{
    public interface IAuthRepository
    {
        Task<User?> Login(LoginDto loginDto);

        Task<User?> Register(RegisterDto registerDto);
    }
}