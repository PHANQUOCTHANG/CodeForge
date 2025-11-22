using CodeForge.Core.Entities;

namespace CodeForge.Core.Interfaces.Repositories
{
    public interface ILanguageRepository
    {
        Task<IEnumerable<LanguageEntity>> GetAllAsync();
        Task<LanguageEntity?> GetByIdAsync(Guid id);
        Task<bool> ExistsByNameAsync(string name);
        Task AddAsync(LanguageEntity language);
        Task UpdateAsync(LanguageEntity language);
        // Delete dùng chung Update (Soft Delete) hoặc viết riêng
    }
}