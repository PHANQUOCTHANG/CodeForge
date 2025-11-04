using CodeForge.Api.DTOs;
using CodeForge.Api.DTOs.Request.User;
using CodeForge.Api.DTOs.Response;
using CodeForge.Core.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CodeForge.Api.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        // --- GET ALL USERS (GET /api/user)
        // [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetUsersAsync()
        {
            // Service returns List<UserDto>
            var result = await _userService.GetUsersAsync();

            // ✅ Return 200 OK, wrapped in ApiResponse<T>
            return Ok(ApiResponse<List<UserDto>>.Success(result, "Users retrieved successfully."));
        }

        // --- CREATE USER (POST /api/user/create)
        [Authorize]
        [HttpPost("create")]
        public async Task<IActionResult> CreateUserAsync([FromBody] CreateUserDto createUserDto)
        {
            // Service returns UserDto (throws ConflictException if email exists)
            var result = await _userService.CreateUserAsync(createUserDto);

            // ✅ RESTful: Return 201 Created. Assuming a GetUserById method exists.
            // We use CreatedAtAction for HTTP 201 response.
            return CreatedAtAction(
                // Change "GetUserByIdAsync" to the actual GET method name for a single user, if available
                nameof(GetUsersAsync),
                new { id = result.UserId }, // Assuming UserDto has an Id property
                ApiResponse<UserDto>.Created(result, "User created successfully.")
            );
        }

        // NOTE: For a complete RESTful controller, you would typically add:
        //
        // [HttpGet("{id}")]
        // public async Task<IActionResult> GetUserByIdAsync(Guid id) { ... }
        //
        // [HttpPatch("{id}")]
        // public async Task<IActionResult> UpdateUserAsync(Guid id, [FromBody] UpdateUserDto dto) { ... }
        //
        // [HttpDelete("{id}")]
        // public async Task<IActionResult> DeleteUserAsync(Guid id) { ... }
    }
}