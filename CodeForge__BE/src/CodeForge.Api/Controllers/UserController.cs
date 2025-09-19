using CodeForge.Api.DTOs;
using CodeForge.Api.DTOs.Request.User;
using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace CodeForge.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsersAsync()
        {
            var users = await _userService.GetUsersAsync();
            var response = new ApiResponse<IEnumerable<UserDto>>(200, "Users retrieved successfully", users);
            return Ok(response);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateUserAsync([FromBody] CreateUserDto userDto)
        {


            var user = await _userService.CreateUserAsync(userDto);
            var response = new ApiResponse<UserDto>(201, "User created successfully", user);
            return Ok(response);
        }

    }
}