using Azure.Core;
using CodeForge.Api.DTOs;
using CodeForge.Api.DTOs.Request.Auth;
using CodeForge.Core.Interfaces.Services;
using CodeForge.Core.Service;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace CodeForge.Api.Controllers
{

    [ApiController]
    [Route("")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;  
        }


        // login .
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                ApiResponse<AuthDto> response = await _authService.Login(loginDto);
                return response.Code switch
                {
                    200 => Ok(response) ,
                    401 => Unauthorized(response),
                    404 => Unauthorized(response),
                    _ => StatusCode(500,response)
                };
            }
            catch (Exception ex)
            {
                // Log lỗi ở đây (Serilog, NLog, v.v.)
                return StatusCode(500, new { message = "Server error", detail = ex.Message });
            }
        }


        // register .
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            try
            {
                ApiResponse<AuthDto> response = await _authService.Register(registerDto);
                return response.Code switch
                {
                    200 => Ok(response) ,
                    401 => Unauthorized(response),
                    404 => Unauthorized(response),
                    _ => StatusCode(500,response)
                };
            }
            catch (Exception ex)
            {
                // Log lỗi ở đây (Serilog, NLog, v.v.)
                return StatusCode(500, new { message = "Server error", detail = ex.Message });
            }
        }
    }
}