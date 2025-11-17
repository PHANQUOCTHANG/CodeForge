using System.Text.Json;
using AutoMapper;
using CodeForge.Api.DTOs.Request.Comment;
using CodeForge.Api.DTOs.Request.Thread;
using CodeForge.Api.DTOs.Response;
using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Core.Interfaces.Services;
using CodeForge.Infrastructure.Data;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace CodeForge.Core.Services
{
    public class ThreadService : IThreadService
    {
        private readonly IThreadRepository _repo;
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _context;

        public ThreadService(
            IThreadRepository repo, 
            IMapper mapper, 
            ApplicationDbContext context)
        {
            _repo = repo;
            _mapper = mapper;
            _context = context;
        }

        // ✅ CREATE - Dùng Raw SQL
        public async Task<ThreadDto> CreateAsync(CreateThreadDto dto)
        {
            var threadId = Guid.NewGuid();
            var now = DateTime.UtcNow;
            var tags = JsonSerializer.Serialize(dto.Tags);

            var sql = @"
                INSERT INTO DiscussionThreads 
                (ThreadID, UserID, Title, Content, ImageUrl, Tags, Likes, Shares, CreatedAt, IsDeleted)
                VALUES 
                (@ThreadID, @UserID, @Title, @Content, @ImageUrl, @Tags, @Likes, @Shares, @CreatedAt, @IsDeleted)
            ";

            var parameters = new[]
            {
                new SqlParameter("@ThreadID", System.Data.SqlDbType.UniqueIdentifier) 
                    { Value = threadId },
                new SqlParameter("@UserID", System.Data.SqlDbType.UniqueIdentifier) 
                    { Value = dto.UserID },
                new SqlParameter("@Title", System.Data.SqlDbType.NVarChar, 255) 
                    { Value = dto.Title },
                new SqlParameter("@Content", System.Data.SqlDbType.NVarChar, -1) 
                    { Value = dto.Content },
                new SqlParameter("@ImageUrl", System.Data.SqlDbType.NVarChar, -1) 
                    { Value = (object?)dto.ImageUrl ?? DBNull.Value },
                new SqlParameter("@Tags", System.Data.SqlDbType.NVarChar, -1) 
                    { Value = tags },
                new SqlParameter("@Likes", System.Data.SqlDbType.Int) 
                    { Value = 0 },
                new SqlParameter("@Shares", System.Data.SqlDbType.Int) 
                    { Value = 0 },
                new SqlParameter("@CreatedAt", System.Data.SqlDbType.DateTime2) 
                    { Value = now },
                new SqlParameter("@IsDeleted", System.Data.SqlDbType.Bit) 
                    { Value = false }
            };

            await _context.Database.ExecuteSqlRawAsync(sql, parameters);

            // Fetch lại để map sang DTO
            var created = await _context.DiscussionThreads
                .Include(t => t.User)
                    .ThenInclude(u => u.Profile)
                .Include(t => t.Comments)
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.ThreadID == threadId);

            return _mapper.Map<ThreadDto>(created);
        }

        // ✅ GET ALL - Dùng Repository
        public async Task<List<ThreadDto>> GetAllAsync()
        {
            var threads = await _repo.GetAllAsyncWithIncludes();
            return threads.Select(t => _mapper.Map<ThreadDto>(t)).ToList();
        }

        // ✅ GET BY ID - Dùng Repository + AutoMapper
        public async Task<ThreadDto?> GetByIdAsync(Guid id)
        {
            var thread = await _repo.GetByIdWithIncludes(id);
            if (thread == null) return null;
            
            return _mapper.Map<ThreadDto>(thread);
        }

        // ✅ DELETE - Dùng Repository
        public async Task<bool> DeleteAsync(Guid id)
        {
            return await _repo.DeleteAsync(id);
        }
        public async Task<int> IncrementLikeAsync(Guid threadId)
{
    // 1. Cập nhật trực tiếp trong DB
    var updateSql = @"
        UPDATE DiscussionThreads 
        SET Likes = Likes + 1 
        WHERE ThreadID = @ThreadID AND IsDeleted = 0;
    ";

    var parameter = new SqlParameter("@ThreadID", System.Data.SqlDbType.UniqueIdentifier) 
        { Value = threadId };

    await _context.Database.ExecuteSqlRawAsync(updateSql, parameter);

    // 2. Query lại để lấy giá trị Likes mới nhất từ DB
    var newLikeCount = await _context.DiscussionThreads
        .AsNoTracking()
        .Where(t => t.ThreadID == threadId)
        .Select(t => t.Likes)
        .FirstOrDefaultAsync();

    return newLikeCount;
}

        public async Task<int> DecrementLikeAsync(Guid threadId)
{
    // 1. Cập nhật trực tiếp trong DB (giảm, nhưng không âm)
    var updateSql = @"
        UPDATE DiscussionThreads 
        SET Likes = CASE WHEN Likes > 0 THEN Likes - 1 ELSE 0 END 
        WHERE ThreadID = @ThreadID AND IsDeleted = 0;
    ";

    var parameter = new SqlParameter("@ThreadID", System.Data.SqlDbType.UniqueIdentifier) 
        { Value = threadId };
    
    await _context.Database.ExecuteSqlRawAsync(updateSql, parameter);

    // 2. Query lại để lấy giá trị Likes mới nhất từ DB
    var newLikeCount = await _context.DiscussionThreads
        .AsNoTracking()
        .Where(t => t.ThreadID == threadId)
        .Select(t => t.Likes)
        .FirstOrDefaultAsync();

    return newLikeCount;
}
    }
}