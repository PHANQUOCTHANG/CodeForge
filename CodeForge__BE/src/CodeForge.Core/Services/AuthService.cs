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

        public async Task<AuthDto> Login(LoginDto loginDto)
        {
            User? user = await _authRepository.Login(loginDto);
            if (user == null) return new AuthDto { Code = (int)LoginResult.UserNotFound, Message = "Invalid" };
            if (!BCrypt.Net.BCrypt.Verify(loginDto.PasswordHash, user.PasswordHash))
                return new AuthDto { Code = (int)LoginResult.InvalidPassword, Message = "Invalid Password" }; // Sai mật khẩu
            string token = GenerateJwtToken(loginDto.Email);
            return new AuthDto { Code = (int)LoginResult.Success, AccessToken = token, Message = "Login success" };
        }

        public async Task<AuthDto> Register(RegisterDto registerDto)
        {
            User? user = await _authRepository.Register(registerDto);
            if (user == null) return new AuthDto { Code = (int)LoginResult.UserNotFound, Message = "User is exists" };
            string token = GenerateJwtToken(registerDto.Email);
            return new AuthDto { Code = (int)LoginResult.Success, AccessToken = token, Message = "Register success" };
        }
    }
}

