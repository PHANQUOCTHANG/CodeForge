
using CodeForge.Api.DTOs;
using CodeForge.Api.DTOs.Request.User;
using CodeForge.Api.DTOs.Response;
using CodeForge.Core.Models;

namespace CodeForge.Core.Interfaces.Services
{
    public interface IUserService
    {
        Task<List<UserDto>> GetUsersAsync();
        Task<UserDto> CreateUserAsync(CreateUserDto createUserDto);
        Task<PaginationResult<UserDto>> GetPagedUsersAsync(int page, int pageSize, string? search, string? role, string? status);
        Task<UserDto> GetUserByIdAsync(Guid id);
        Task<UserDto> UpdateUserAsync(Guid id, UpdateUserDto dto);
        Task DeleteUserAsync(Guid id);
    }
}