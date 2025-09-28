

using CodeForge.Api.DTOs;
using CodeForge.Api.DTOs.Request.User;
using CodeForge.Core.Entities;

namespace CodeForge.Core.Interfaces.Services
{
    public interface IUserService
    {
        Task<ApiResponse<List<UserDto>>> GetUsersAsync();
        Task<ApiResponse<UserDto>> CreateUserAsync(CreateUserDto createUserDto);
        
    }
}