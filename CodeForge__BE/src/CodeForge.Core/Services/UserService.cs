using AutoMapper;
using CodeForge.Api.DTOs;
using CodeForge.Api.DTOs.Request.User;
using CodeForge.Api.DTOs.Response;
using CodeForge.Core.Entities;
using CodeForge.Core.Exceptions;
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

        // --- GET All Users ---
        // ✅ Kiểu trả về mới: Task<List<UserDto>>
        public async Task<List<UserDto>> GetUsersAsync()
        {
            // Bỏ khối try-catch
            List<User> users = await _userRepository.GetAllAsync();
            return _mapper.Map<List<UserDto>>(users);
        }

        // ✅ Kiểu trả về mới: Task<UserDto>
        public async Task<UserDto> CreateUserAsync(CreateUserDto createUserDto)
        {
            // Bỏ khối try-catch
            bool isExistsByEmail = await _userRepository.ExistsByEmail(createUserDto);

            // ✅ SỬA: Thay thế return new ApiResponse<UserDto>(404, ...) bằng ConflictException (409)
            if (isExistsByEmail)
            {
                throw new ConflictException($"Email '{createUserDto.Email}' already exists.");
            }

            // Logic tạo User và mapping DTO
            User user = await _userRepository.CreateAsync(createUserDto);

            return _mapper.Map<UserDto>(user);
        }
    }
}