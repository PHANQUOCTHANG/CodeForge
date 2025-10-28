
using CodeForge.Api.DTOs.Request.Auth;
using CodeForge.Core.Entities;

namespace CodeForge.Core.Interfaces.Repositories
{
    public interface IAuthRepository
    {
        Task<User?> GetUserByEmailAsync(string email);
        Task<User?> GetTrackedUserByEmailAsync(string email);
        Task AddUserAsync(User user);
        Task ClearExpireToken();

        Task AddRefreshTokenAsync(RefreshToken token);
        Task<RefreshToken?> GetRefreshTokenAsync(string tokenHash);
        Task UpdateRefreshTokenAsync(RefreshToken token);
        Task SaveChangesAsync();
    }
}