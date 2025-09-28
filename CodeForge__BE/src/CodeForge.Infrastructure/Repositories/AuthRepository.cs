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
        private readonly IMapper _mapper;
        public AuthRepository(ApplicationDbContext context, IMapper mapper) { _context = context; _mapper = mapper; }


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
            registerDto.PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.PasswordHash);
            User newUser = _mapper.Map<User>(registerDto);
            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();
            return newUser;
        }
    }
}