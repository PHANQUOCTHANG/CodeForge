// using AutoMapper;
// using CodeForge.Api.DTOs.Request.Comment;
// using CodeForge.Api.DTOs.Response;
// using CodeForge.Core.Entities;
// using CodeForge.Core.Interfaces;
// using CodeForge.Infrastructure.Data;
// using Microsoft.EntityFrameworkCore;

// namespace CodeForge.Core.Services
// {
//     public class CommentService : ICommentService
//     {
//         private readonly ApplicationDbContext _context;
//         private readonly IMapper _mapper;

//         public CommentService(ApplicationDbContext context, IMapper mapper)
//         {
//             _context = context;
//             _mapper = mapper;
//         }

//         // ------------------------------
//         // Tạo comment mới
//         // ------------------------------
//         public async Task<CommentDto> CreateAsync(CreateCommentDto dto)
//         {
//             // Kiểm tra Thread tồn tại
//             var threadExists = await _context.DiscussionThreads
//                 .FromSqlRaw("SELECT * FROM DiscussionThreads WHERE ThreadID = {0} AND IsDeleted = 0", dto.ThreadID)
//                 .AnyAsync();

//             if (!threadExists)
//                 throw new KeyNotFoundException("Thread not found");

//             // Kiểm tra User tồn tại
//             var userExists = await _context.Users
//                 .FromSqlRaw("SELECT * FROM Users WHERE UserID = {0}", dto.UserID)
//                 .AnyAsync();

//             if (!userExists)
//                 throw new KeyNotFoundException("User not found");

//             var commentId = Guid.NewGuid();
//             var createdAt = DateTime.UtcNow;

//             // Thêm comment mới
//             var sqlInsert = @"
//                 INSERT INTO Comments (CommentID, ThreadID, UserID, Content, ParentCommentID, CreatedAt, IsDeleted)
//                 VALUES ({0}, {1}, {2}, {3}, {4}, {5}, 0)
//             ";

//             await _context.Database.ExecuteSqlRawAsync(
//                 sqlInsert,
//                 commentId,
//                 dto.ThreadID,
//                 dto.UserID,
//                 dto.Content,
//                 dto.ParentCommentID.HasValue ? dto.ParentCommentID.Value : (object)DBNull.Value,
//                 createdAt
//             );

//             // Load comment vừa tạo kèm User & Profile
//             var created = await _context.Comments
//                 .FromSqlRaw("SELECT * FROM Comments WHERE CommentID = {0}", commentId)
//                 .Include(c => c.User)
//                     .ThenInclude(u => u.Profile)
//                 .AsNoTracking()
//                 .FirstOrDefaultAsync();

//             return _mapper.Map<CommentDto>(created);
//         }

//         // ------------------------------
//         // Lấy tất cả comment của thread
//         // ------------------------------
//         public async Task<List<CommentDto>> GetByThreadIdAsync(Guid threadId)
//         {
//             var comments = await _context.Comments
//                 .FromSqlRaw(@"
//                     SELECT * FROM Comments
//                     WHERE ThreadID = {0} AND IsDeleted = 0
//                     ORDER BY CreatedAt", threadId)
//                 .Include(c => c.User)
//                     .ThenInclude(u => u.Profile)
//                 .AsNoTracking()
//                 .ToListAsync();

//             return comments.Select(c => _mapper.Map<CommentDto>(c)).ToList();
//         }

//         // ------------------------------
//         // Xóa comment (soft delete)
//         // ------------------------------
//         public async Task<bool> DeleteAsync(Guid commentId, Guid userId)
//         {
//             var sql = @"
//                 UPDATE Comments
//                 SET IsDeleted = 1
//                 WHERE CommentID = {0} AND UserID = {1} AND IsDeleted = 0
//             ";

//             var affected = await _context.Database.ExecuteSqlRawAsync(sql, commentId, userId);

//             return affected > 0;
//         }

//         // ------------------------------
//         // Lấy comment theo ID
//         // ------------------------------
//         public async Task<Comment?> GetByIdAsync(Guid id)
//         {
//             var comment = await _context.Comments
//                 .FromSqlRaw("SELECT * FROM Comments WHERE CommentID = {0}", id)
//                 .Include(c => c.User)
//                     .ThenInclude(u => u.Profile)
//                 .AsNoTracking()
//                 .FirstOrDefaultAsync();

//             return comment;
//         }

//         // ------------------------------
//         // Lấy replies của comment
//         // ------------------------------
//         public async Task<IEnumerable<Comment>> GetRepliesAsync(Guid parentCommentId)
//         {
//             var replies = await _context.Comments
//                 .FromSqlRaw("SELECT * FROM Comments WHERE ParentCommentID = {0} AND IsDeleted = 0", parentCommentId)
//                 .Include(c => c.User)
//                     .ThenInclude(u => u.Profile)
//                 .AsNoTracking()
//                 .ToListAsync();

//             return replies;
//         }

//         // ------------------------------
//         // Cập nhật nội dung comment
//         // ------------------------------
//         public async Task<bool> UpdateAsync(Guid id, string content)
//         {
//             var sql = @"
//                 UPDATE Comments
//                 SET Content = {0}
//                 WHERE CommentID = {1} AND IsDeleted = 0
//             ";

//             var affected = await _context.Database.ExecuteSqlRawAsync(sql, content, id);

//             return affected > 0;
//         }
//     }
// }
