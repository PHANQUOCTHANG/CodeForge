

using CodeForge.Api.DTOs;
using CodeForge.Core.Entities;

namespace CodeForge.Core.Interfaces.Repositories
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetUsersAsync();

        Task<User> CreateUserAsync(UserDto userDto); 
    }
}