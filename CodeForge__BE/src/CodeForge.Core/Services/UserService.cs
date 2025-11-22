using AutoMapper;
using CodeForge.Api.DTOs;
using CodeForge.Api.DTOs.Request.User;
using CodeForge.Api.DTOs.Response;
using CodeForge.Core.Entities;
using CodeForge.Core.Exceptions;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Core.Interfaces.Services;
using CodeForge.Core.Models;
using UserProfile = CodeForge.Core.Entities.Profile;
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
        public async Task<PaginationResult<UserDto>> GetPagedUsersAsync(int page, int pageSize, string? search, string? role, string? status)
        {
            var (users, totalItems) = await _userRepository.GetPagedUsersAsync(page, pageSize, search, role, status);
            var userDtos = _mapper.Map<IEnumerable<UserDto>>(users);

            return new PaginationResult<UserDto>(userDtos, totalItems, page, pageSize);
        }

        public async Task<UserDto> GetUserByIdAsync(Guid id)
        {
            var user = await _userRepository.GetByIdWithProfileAsync(id);
            if (user == null) throw new NotFoundException("User not found");
            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> CreateUserAsync(CreateUserDto dto)
        {
            // 1. Check duplicate
            if (await _userRepository.GetByUsernameAsync(dto.Username) != null)
                throw new ConflictException("Username already exists.");
            if (await _userRepository.GetByEmailAsync(dto.Email) != null)
                throw new ConflictException("Email already exists.");

            // 2. Create Entity
            var user = _mapper.Map<User>(dto);
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password); // Hash pass
            user.Status = "active";
            
            // 3. Tạo Profile mặc định luôn
            user.Profile = new UserProfile 
            { 
                ProfileID = Guid.NewGuid(),
                FullName = dto.Username, // Tạm lấy username làm tên
                Level = 1,
                Points = 0
            };

            await _userRepository.AddAsync(user);

            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> UpdateUserAsync(Guid id, UpdateUserDto dto)
        {
            var user = await _userRepository.GetByIdWithProfileAsync(id);
            if (user == null) throw new NotFoundException("User not found");

            // Update User fields
            if (!string.IsNullOrEmpty(dto.Role)) user.Role = dto.Role;
            if (!string.IsNullOrEmpty(dto.Status)) user.Status = dto.Status;

            // Update Profile fields
            if (!string.IsNullOrEmpty(dto.FullName))
            {
                if (user.Profile == null) user.Profile = new UserProfile { ProfileID = Guid.NewGuid() };
                user.Profile.FullName = dto.FullName;
            }

            await _userRepository.UpdateAsync(user);
            return _mapper.Map<UserDto>(user);
        }

        public async Task DeleteUserAsync(Guid id)
        {
            var user = await _userRepository.GetByIdWithProfileAsync(id);
            if (user == null) throw new NotFoundException("User not found");

            // Soft Delete
            user.IsDeleted = true;
            user.Status = "deleted";
            
            // Có thể soft delete cả profile nếu muốn
            if(user.Profile != null) user.Profile.IsDeleted = true;

            await _userRepository.UpdateAsync(user);
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

    }
}