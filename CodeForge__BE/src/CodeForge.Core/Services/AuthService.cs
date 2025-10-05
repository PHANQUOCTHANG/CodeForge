using CodeForge.Api.DTOs;
using CodeForge.Api.DTOs.Request.Auth;
using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Core.Interfaces.Services;

using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CodeForge.Core.Service
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly IConfiguration _config;
        public AuthService(IAuthRepository authRepository, IConfiguration config)
        {
            _authRepository = authRepository;
            _config = config;
        }

        private string GenerateJwtToken(string email)
        {
            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, email),
            new Claim("role", "admin"),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<ApiResponse<AuthDto>> Login(LoginDto loginDto)
        {
            User? user = await _authRepository.Login(loginDto);
            if (user == null) return new ApiResponse<AuthDto>(404, "Invalid User", new AuthDto { isSuccess = false});
            if (!BCrypt.Net.BCrypt.Verify(loginDto.PasswordHash, user.PasswordHash))  return new ApiResponse<AuthDto>(404, "Invalid Password", new AuthDto { isSuccess = false});
            string token = GenerateJwtToken(loginDto.Email);
             return new ApiResponse<AuthDto>(200, "Login success", new AuthDto { isSuccess = true , AccessToken = token});
        }

        public async Task<ApiResponse<AuthDto>> Register(RegisterDto registerDto)
        {
            User? user = await _authRepository.Register(registerDto);
            if (user == null)  return new ApiResponse<AuthDto>(404, "Invalid User", new AuthDto { isSuccess = false});
            string token = GenerateJwtToken(registerDto.Email);
            return new ApiResponse<AuthDto>(200, "Register success", new AuthDto { isSuccess = true , AccessToken = token});
        }
    }
}

