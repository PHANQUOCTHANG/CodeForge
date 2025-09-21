using AutoMapper;
using CodeForge.Api.DTOs.Request.Auth;
using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;


namespace CodeForge.Infrastructure.Repositories
{
    public class AuthRepository : IAuthRepository
    {

        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;
        public AuthRepository(ApplicationDbContext context, IMapper mapper, IConfiguration config) { _context = context; _config = config; }


        public async Task<User?> Login(LoginDto loginDto)
        {

            User? user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
            if (user == null) return null;

            return user;
        }

        public async Task<User?> Register(RegisterDto registerDto)
        {
            User? user = await _context.Users.FirstOrDefaultAsync(u => u.Email == registerDto.Email && u.Username == registerDto.Username);
            if (user != null) return null;
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(registerDto.PasswordHash);
            User newUser = new User(
                registerDto.Username,
                registerDto.Email,
                hashedPassword,
                registerDto.Role
            );
            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();
            return newUser;
        }
    }
}