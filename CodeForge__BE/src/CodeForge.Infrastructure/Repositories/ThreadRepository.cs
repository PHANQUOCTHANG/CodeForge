using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

public class ThreadRepository : IThreadRepository
    {
        private readonly ApplicationDbContext _context;

        public ThreadRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<DiscussionThread> CreateAsync(DiscussionThread thread)
        {
            _context.ChangeTracker.Clear();
            await _context.DiscussionThreads.AddAsync(thread);
            await _context.SaveChangesAsync();
            return thread;
        }

        public async Task<List<DiscussionThread>> GetAllAsync()
        {
            return await _context.DiscussionThreads
                .Where(t => !t.IsDeleted)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<List<DiscussionThread>> GetAllAsyncWithIncludes()
        {
            return await _context.DiscussionThreads
                .Include(t => t.User)
                    .ThenInclude(u => u.Profile)
                .Include(t => t.Comments)
                .Where(t => !t.IsDeleted)
                .OrderByDescending(t => t.CreatedAt)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<DiscussionThread?> GetByIdAsync(Guid id)
        {
            return await _context.DiscussionThreads
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.ThreadID == id && !t.IsDeleted);
        }

        public async Task<DiscussionThread?> GetByIdWithIncludes(Guid id)
        {
            return await _context.DiscussionThreads
                .Include(t => t.User)
                    .ThenInclude(u => u.Profile)
                .Include(t => t.Comments)
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.ThreadID == id && !t.IsDeleted);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var thread = await _context.DiscussionThreads
                .FirstOrDefaultAsync(t => t.ThreadID == id);
            
            if (thread == null) return false;

            thread.IsDeleted = true;
            await _context.SaveChangesAsync();
            return true;
        }
    }
