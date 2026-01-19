
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

        // OTP Methods
        Task<Otp?> GetLatestOtpByEmailAsync(string email);
        Task AddOtpAsync(Otp otp);
        Task UpdateOtpAsync(Otp otp);
        Task<User?> GetUserByEmailForUpdateAsync(string email);
        void UpdateUserPassword(User user);

        // Reset Token Methods
        Task AddResetTokenAsync(ResetToken resetToken);
        Task<ResetToken?> GetResetTokenAsync(string token);
        Task UpdateResetTokenAsync(ResetToken resetToken);
    }
}