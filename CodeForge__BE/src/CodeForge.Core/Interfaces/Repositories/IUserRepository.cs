

using CodeForge.Api.DTOs.Request.User;
using CodeForge.Core.Entities;

namespace CodeForge.Core.Interfaces.Repositories
{
    public interface IUserRepository
    {
        Task<List<User>> GetAllAsync();

        Task<User> CreateAsync(CreateUserDto createUserDto);

        Task<bool> ExistsByEmail(CreateUserDto createUserDto);
    }
}