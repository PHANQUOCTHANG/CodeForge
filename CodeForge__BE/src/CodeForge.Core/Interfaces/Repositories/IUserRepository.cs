

using CodeForge.Api.DTOs.Request.User;
using CodeForge.Core.Entities;

namespace CodeForge.Core.Interfaces.Repositories
{
    public interface IUserRepository
    {
        Task<(IEnumerable<User> Data, int TotalItems)> GetPagedUsersAsync(
            int page, int pageSize, string? search, string? role, string? status);
        Task<User?> GetByIdWithProfileAsync(Guid id);
        Task<User?> GetByUsernameAsync(string username);
        Task<User?> GetByEmailAsync(string email);
        
        Task AddAsync(User user);
        Task<List<User>> GetAllAsync();
        Task UpdateAsync(User user);

        Task<bool> ExistsByEmail(CreateUserDto createUserDto);
    }
}