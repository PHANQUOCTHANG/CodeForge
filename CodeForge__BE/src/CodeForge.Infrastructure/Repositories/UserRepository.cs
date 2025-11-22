
using AutoMapper;
using CodeForge.Api.DTOs.Request.User;
using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CodeForge.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public UserRepository(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<User>> GetAllAsync()
        {
            return await _context.Users.ToListAsync();
        }
        public async Task<(IEnumerable<User> Data, int TotalItems)> GetPagedUsersAsync(
            int page, int pageSize, string? search, string? role, string? status)
        {
            var query = _context.Users
                .Include(u => u.Profile) // Join bảng Profile
                .Where(u => !u.IsDeleted); // Lọc đã xóa

            // Filter
            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.ToLower();
                query = query.Where(u => u.Username.ToLower().Contains(search) || 
                                         u.Email.ToLower().Contains(search) ||
                                         (u.Profile != null && u.Profile.FullName.ToLower().Contains(search)));
            }

            if (!string.IsNullOrWhiteSpace(role) && role != "All")
                query = query.Where(u => u.Role == role);

            if (!string.IsNullOrWhiteSpace(status) && status != "All")
                query = query.Where(u => u.Status == status);

            var totalItems = await query.CountAsync();

            var data = await query
                .OrderByDescending(u => u.JoinDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (data, totalItems);
        }
        public async Task<User?> GetByIdWithProfileAsync(Guid id)
        {
            return await _context.Users
                .Include(u => u.Profile)
                .FirstOrDefaultAsync(u => u.UserId == id && !u.IsDeleted);
        }
        public async Task<User?> GetByUsernameAsync(string username)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Username == username && !u.IsDeleted);
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email && !u.IsDeleted);
        }

        public async Task AddAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsByEmail(CreateUserDto createUserDto)
        {
            var User = await _context.Users.FirstOrDefaultAsync(u => u.Email == createUserDto.Email);
            return User != null;
        }
    }
}