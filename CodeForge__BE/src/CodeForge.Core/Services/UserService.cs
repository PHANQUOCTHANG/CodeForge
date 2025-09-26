using AutoMapper;
using CodeForge.Api.DTOs.Request.User;
using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Core.Interfaces.Services;

namespace CodeForge.Core.Service
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UserService(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<UserDto>> GetUsersAsync()
        {
            IEnumerable<User> users = await _userRepository.GetUsersAsync();
            return _mapper.Map<IEnumerable<UserDto>>(users);
        }

        public async Task<UserDto> CreateUserAsync(CreateUserDto userDto)
        {
            User user = await _userRepository.CreateUserAsync(userDto);
            return _mapper.Map<UserDto>(user);
        }
    }
}