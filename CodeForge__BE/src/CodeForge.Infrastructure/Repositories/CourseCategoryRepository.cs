using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CodeForge.Infrastructure.Repositories
{
    public class CourseCategoryRepository : ICourseCategoryRepository
    {
        private readonly ApplicationDbContext _context;

        public CourseCategoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<CourseCategory>> GetAllAsync() =>
            await _context.CourseCategory
                .Where(c => !c.IsDeleted)
                .AsNoTracking()
                .ToListAsync();

        public async Task<CourseCategory?> GetByIdAsync(Guid id) =>
            await _context.CourseCategory
                .FirstOrDefaultAsync(c => c.CategoryId == id && !c.IsDeleted);

        public async Task<CourseCategory> AddAsync(CourseCategory category)
        {
            await _context.CourseCategory.AddAsync(category);
            await _context.SaveChangesAsync();
            return category;
        }

        // Giả định entity đã được tải (tracked)
        public async Task UpdateAsync(CourseCategory category)
        {
            _context.CourseCategory.Update(category);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var category = await GetByIdAsync(id);
            if (category == null) return false;

            category.IsDeleted = true; // Xóa mềm
            await UpdateAsync(category);
            return true;
        }

        public async Task<bool> ExistsByNameAsync(string name) =>
            await _context.CourseCategory
                .AnyAsync(c => c.Name == name && !c.IsDeleted);
    }
}