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


    }
}