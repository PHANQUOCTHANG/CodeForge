using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CodeForge.Core.Entities;
using CodeForge.Infrastructure.Data;
using CodeForge__BE.src.CodeForge.Core.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CodeForge__BE.src.CodeForge.Infrastructure.Repositories
{
    public class CourseRepository : ICourseRepository
    {
        private readonly ApplicationDbContext _context;
        public CourseRepository(ApplicationDbContext _context)
        {
            this._context = _context;
        }
        public async Task<IEnumerable<Course>> GetAllAsync()
        {
            return await _context.courses.ToListAsync();
        }

        public async Task<Course?> GetByIdAsync(Guid id)
        {
            return await _context.courses.FindAsync(id);
        }

        public async Task<Course> AddAsync(Course course)
        {
            _context.courses.Add(course);
            await _context.SaveChangesAsync();
            return course;
        }

        public async Task UpdateAsync(Course course)
        {
            _context.courses.Update(course);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Course course)
        {
            _context.courses.Remove(course);
            await _context.SaveChangesAsync();
        }
    }
}