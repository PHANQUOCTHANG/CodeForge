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
                AuthDto authDto = await _authService.Login(loginDto);
                return authDto.Code switch
                {
                    200 => Ok(new { code = 200, message = authDto.Message, accessToken = authDto.AccessToken }),
                    401 => Unauthorized(new {code = 401  , message = authDto.Message }),
                    404 => Unauthorized(new {code = 404 , message = authDto.Message }),
                    _ => StatusCode(500, new {code = 500 , message = "Unexpected error" })
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
                AuthDto authDto = await _authService.Register(registerDto);
                return authDto.Code switch
                {
                    200 => Ok(new { code = 200, message = authDto.Message, accessToken = authDto.AccessToken }),
                    401 => Unauthorized(new {code = 401 , message = authDto.Message }),
                    404 => Unauthorized(new {code = 404 , message = authDto.Message }),
                    _ => StatusCode(500, new {code = 500 , message = "Unexpected error" })
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