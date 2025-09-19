

using CodeForge.Api.DTOs.Request.User;
using CodeForge.Core.Entities;

namespace CodeForge.Core.Interfaces.Repositories
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetUsersAsync();

        Task<User> CreateUserAsync(CreateUserDto userDto); 
    }
}