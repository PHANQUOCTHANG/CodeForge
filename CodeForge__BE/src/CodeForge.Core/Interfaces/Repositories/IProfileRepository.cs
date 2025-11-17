using CodeForge.Core.Entities;

namespace CodeForge.Core.Interfaces
{
    public interface IProfileRepository
    {
        Task<Profile?> GetByUserIdAsync(Guid userId);
        Task<Profile?> GetByIdAsync(Guid profileId);
        Task<IEnumerable<Profile>> GetAllAsync();
        Task AddAsync(Profile profile);
        Task UpdateAsync(Profile profile);
        Task DeleteAsync(Guid profileId);
        Task SaveChangesAsync();
    }
}
