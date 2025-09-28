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


        // get all user .
        [HttpGet]
        public async Task<IActionResult> GetUsersAsync()
        {
            var response = await _userService.GetUsersAsync();
            return Ok(response);
        }

        // create user .
        [HttpPost("create")]
        public async Task<IActionResult> CreateUserAsync([FromBody] CreateUserDto createUserDto)
        {
            var response = await _userService.CreateUserAsync(createUserDto);
            return Ok(response);
        }

    }
}