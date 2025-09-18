

using CodeForge.Api.DTOs;
using CodeForge.Core.Entities;

namespace CodeForge.Core.Interfaces.Services
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetUsersAsync();
        Task<User> CreateUserAsync(UserDto userDto);
    }
}