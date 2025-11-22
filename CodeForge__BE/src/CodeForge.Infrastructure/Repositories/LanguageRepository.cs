using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CodeForge.Infrastructure.Repositories
{
    public class LanguageRepository : ILanguageRepository
    {
        private readonly ApplicationDbContext _context;

        public LanguageRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<LanguageEntity>> GetAllAsync()
        {
            return await _context.Languages
                .Where(x => !x.IsDeleted) // Chỉ lấy cái chưa xóa
                .OrderBy(x => x.Name)
                .ToListAsync();
        }

        public async Task<LanguageEntity?> GetByIdAsync(Guid id)
        {
            return await _context.Languages
                .FirstOrDefaultAsync(x => x.LanguageID == id && !x.IsDeleted);
        }

        public async Task<bool> ExistsByNameAsync(string name)
        {
            return await _context.Languages
                .AnyAsync(x => x.Name == name && !x.IsDeleted);
        }

        public async Task AddAsync(LanguageEntity language)
        {
            await _context.Languages.AddAsync(language);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(LanguageEntity language)
        {
            _context.Languages.Update(language);
            await _context.SaveChangesAsync();
        }
    }
}