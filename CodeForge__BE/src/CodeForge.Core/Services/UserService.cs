

using CodeForge.Api.DTOs;
using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Services;

namespace CodeForge.Core.Interfaces.Repositories
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<User>> GetUsersAsync()
        {
            return await _userRepository.GetUsersAsync();
        }

        public async Task<User> CreateUserAsync(UserDto userDto)
        {
            return await _userRepository.CreateUserAsync(userDto);
        }
    }
}