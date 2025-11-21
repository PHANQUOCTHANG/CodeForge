using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces;
using CodeForge.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CodeForge.Infrastructure.Repositories
{
    public class ProfileRepository : IProfileRepository
    {
        private readonly ApplicationDbContext _context;

        public ProfileRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Profile>> GetAllAsync()
        {
            return await _context.Profiles
                .Where(p => !p.IsDeleted)
                .Include(p => p.User)
                .ToListAsync();
        }

        public async Task<Profile?> GetByUserIdAsync(Guid userId)
        {
            return await _context.Profiles
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.UserID == userId && !p.IsDeleted);
        }

        public async Task<Profile?> GetByIdAsync(Guid profileId)
        {
            return await _context.Profiles
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.ProfileID == profileId && !p.IsDeleted);
        }

        public async Task AddAsync(Profile profile)
        {
            await _context.Profiles.AddAsync(profile);
        }

        public async Task UpdateAsync(Profile profile)
        {
            _context.Profiles.Update(profile);
        }

        public async Task DeleteAsync(Guid profileId)
        {
            var profile = await GetByIdAsync(profileId);
            if (profile != null)
            {
                profile.IsDeleted = true;
                _context.Profiles.Update(profile);
            }
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
