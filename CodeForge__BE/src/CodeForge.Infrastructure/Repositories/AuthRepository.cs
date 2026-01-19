using AutoMapper;
using CodeForge.Api.DTOs.Request.Auth;
using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;


namespace CodeForge.Infrastructure.Repositories
{
    public class AuthRepository : IAuthRepository
    {

        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        public AuthRepository(ApplicationDbContext context, IMapper mapper) { _context = context; _mapper = mapper; }
        public async Task<User?> GetUserByEmailAsync(string email) => await _context.Users.Include(u => u.RefreshTokens).AsNoTracking().FirstOrDefaultAsync(u => u.Email == email);
        public async Task<User?> GetTrackedUserByEmailAsync(string email) =>
            await _context.Users
            .Include(u => u.RefreshTokens)
            .FirstOrDefaultAsync(u => u.Email == email);

        public async Task AddUserAsync(User user)
        {
            await _context.Users.AddAsync(user);
        }

        public async Task AddRefreshTokenAsync(RefreshToken token)
        {
            await _context.RefreshTokens.AddAsync(token);
        }

        public async Task<RefreshToken?> GetRefreshTokenAsync(string tokenHash)
        {

            return await _context.RefreshTokens.Include(r => r.User).FirstOrDefaultAsync(r => r.TokenHash == tokenHash);
        }
        public async Task ClearExpireToken()
        {
            _context.RefreshTokens.RemoveRange(
                    _context.RefreshTokens.Where(r => r.ExpiresAt < DateTime.UtcNow.AddDays(-30))
                );
        }
        public async Task UpdateRefreshTokenAsync(RefreshToken token)
        {
            _context.RefreshTokens.Update(token);
        }

        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();

        // ============================
        // OTP METHODS
        // ============================
        public async Task<Otp?> GetLatestOtpByEmailAsync(string email)
        {
            return await _context.Otps
                .Where(o => o.Email == email)
                .OrderByDescending(o => o.CreatedAt)
                .FirstOrDefaultAsync();
        }

        public async Task AddOtpAsync(Otp otp)
        {
            await _context.Otps.AddAsync(otp);
        }

        public async Task UpdateOtpAsync(Otp otp)
        {
            _context.Otps.Update(otp);
        }

        public async Task<User?> GetUserByEmailForUpdateAsync(string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public void UpdateUserPassword(User user)
        {
            _context.Users.Update(user);
        }

        // ============================
        // RESET TOKEN METHODS
        // ============================
        public async Task AddResetTokenAsync(ResetToken resetToken)
        {
            await _context.ResetTokens.AddAsync(resetToken);
        }

        public async Task<ResetToken?> GetResetTokenAsync(string token)
        {
            return await _context.ResetTokens
                .FirstOrDefaultAsync(rt => rt.Token == token);
        }

        public async Task UpdateResetTokenAsync(ResetToken resetToken)
        {
            _context.ResetTokens.Update(resetToken);
        }
    }
}