using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CodeForge.Infrastructure.Repositories
{
    public class ModuleRepository : IModuleRepository
    {
        private readonly ApplicationDbContext _context;

        public ModuleRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Guid?> GetCourseIdByModuleIdAsync(Guid moduleId)
        {
            var courseId = await _context.Modules
                .Where(m => m.ModuleId == moduleId)
                .Select(m => m.CourseId)
                .FirstOrDefaultAsync();

            return courseId == Guid.Empty ? null : courseId;
        }

        public async Task<(Guid? ModuleId, Guid? CourseId)> GetModuleAndCourseIdsByLessonIdAsync(Guid lessonId)
        {
            var result = await _context.Lessons
               .Where(l => l.LessonId == lessonId)
               .Include(l => l.Module)
               .Select(l => new { l.ModuleId, l.Module.CourseId })
               .FirstOrDefaultAsync();

            if (result == null)
            {
                return (null, null);
            }
            return (result.ModuleId, result.CourseId);
        }

        public async Task<Module?> GetByIdAsync(Guid moduleId)
        {
            return await _context.Modules
                .Include(m => m.Lessons) // Load các bài học liên quan
                .FirstOrDefaultAsync(m => m.ModuleId == moduleId);
        }

        public async Task<List<Module>> GetByCourseIdAsync(Guid courseId)
        {
            return await _context.Modules
                .Where(m => m.CourseId == courseId && m.IsDeleted == false)
                .Include(m => m.Lessons.Where(l => l.IsDeleted == false).OrderBy(l => l.OrderIndex))
                .OrderBy(m => m.OrderIndex)
                .ToListAsync();
        }

        public async Task<Module> AddAsync(Module module)
        {
            await _context.Modules.AddAsync(module);
            await _context.SaveChangesAsync();
            return module;
        }

        public async Task<Module> UpdateAsync(Module module)
        {
            _context.Modules.Update(module);
            await _context.SaveChangesAsync();
            return module;
        }

        public async Task DeleteAsync(Module module)
        {
            // Cân nhắc: Xóa mềm (Soft Delete)
            module.IsDeleted = true;
            _context.Modules.Update(module);
            // Hoặc xóa cứng (Hard Delete)
            // _context.Modules.Remove(module);

            // Cần đảm bảo các Lessons con cũng được xử lý (CASCADE)
            await _context.SaveChangesAsync();
        }
    }
}