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

        public async Task<ApiResponse<List<UserDto>>> GetUsersAsync()
        {
            try
            {
                List<User> users = await _userRepository.GetUsersAsync();
                List<UserDto> userDtos = _mapper.Map<List<UserDto>>(users); // user -> userDto . 
                return new ApiResponse<List<UserDto>>(200, "Get all users success", userDtos);
            }
            catch (Exception e)
            {
                return new ApiResponse<List<UserDto>>(500, e.Message);
            }
        }

        public async Task<ApiResponse<UserDto>> CreateUserAsync(CreateUserDto createUserDto)
        {
            try
            {
                bool isExistsByEmail = await _userRepository.ExistsByEmail(createUserDto);
                if (isExistsByEmail)
                {
                    return new ApiResponse<UserDto>(404, "Email is exists");
                }
                User user = await _userRepository.CreateUserAsync(createUserDto);
                UserDto userDto = _mapper.Map<UserDto>(user);

                return new ApiResponse<UserDto>(200, "Create User success", userDto);
            }
            catch (Exception e)
            {
                return new ApiResponse<UserDto>(500, e.Message);
            }
        }
    }
}