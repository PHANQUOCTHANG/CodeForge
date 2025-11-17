using CodeForge.Core.Entities;

namespace CodeForge.Core.Interfaces.Repositories
{
    public interface IThreadRepository
    {
        Task<List<DiscussionThread>> GetAllAsync();
        Task<DiscussionThread?> GetByIdAsync(Guid id);
        Task<DiscussionThread> CreateAsync(DiscussionThread thread);
        Task<bool> DeleteAsync(Guid id);
        Task<List<DiscussionThread>> GetAllAsyncWithIncludes();
        Task<DiscussionThread?> GetByIdWithIncludes(Guid id);

    }
}
