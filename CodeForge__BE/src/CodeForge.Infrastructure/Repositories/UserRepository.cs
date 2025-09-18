

using CodeForge.Api.DTOs;
using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CodeForge.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<User>> GetUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User> CreateUserAsync(UserDto userDto)
        {
            User user = new User(
                userDto.Username, 
                userDto.Email, 
                userDto.PasswordHash
            );
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }
    }
}