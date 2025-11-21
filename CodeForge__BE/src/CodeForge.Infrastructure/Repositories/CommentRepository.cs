// using CodeForge.Core.Entities;
// using CodeForge.Core.Interfaces;
// using CodeForge.Infrastructure.Data;
// using Microsoft.EntityFrameworkCore;

// namespace CodeForge.Infrastructure.Repositories
// {
//     public class CommentRepository : ICommentRepository
//     {
//         private readonly ApplicationDbContext _context;

//         public CommentRepository(ApplicationDbContext context)
//         {
//             _context = context;
//         }

//         public async Task<IEnumerable<Comment>> GetByThreadAsync(Guid threadId)
//         {
//             return await _context.Comments
//                 .Where(c => c.ThreadID == threadId && !c.IsDeleted)
//                 .OrderBy(c => c.CreatedAt)
//                 .ToListAsync();
//         }

//         public async Task<IEnumerable<Comment>> GetRepliesAsync(Guid parentCommentId)
//         {
//             return await _context.Comments
//                 .Where(c => c.ParentCommentID == parentCommentId && !c.IsDeleted)
//                 .OrderBy(c => c.CreatedAt)
//                 .ToListAsync();
//         }

//         public async Task<Comment?> GetByIdAsync(Guid id)
//         {
//             return await _context.Comments
//                 .FirstOrDefaultAsync(c => c.CommentID == id && !c.IsDeleted);
//         }

//         public async Task AddAsync(Comment comment)
//         {
//             _context.Comments.Add(comment);
//             await _context.SaveChangesAsync();
//         }

//         public async Task UpdateAsync(Comment comment)
//         {
//             _context.Comments.Update(comment);
//             await _context.SaveChangesAsync();
//         }

//         public async Task DeleteAsync(Guid id)
//         {
//             var comment = await GetByIdAsync(id);
//             if (comment != null)
//             {
//                 comment.IsDeleted = true;
//                 await _context.SaveChangesAsync();
//             }
//         }
//     }
// }
