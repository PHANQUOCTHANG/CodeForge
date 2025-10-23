
using AutoMapper;
using CodeForge.Core.Entities;
using CodeForge.Infrastructure.Data;
using CodeForge.Api.DTOs.Request.Course;
using CodeForge.Core.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CodeForge.Infrastructure.Repositories
{
    public class CourseRepository : ICourseRepository
    {

        private readonly ApplicationDbContext _context;

        private readonly IMapper _mapper;
        public CourseRepository(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<(IEnumerable<Course> Data, int TotalItems)> GetPagedCoursesAsync(
            int page, int pageSize, string? search)
        {
            var query = _context.Courses
                .Include(c => c.Category)
                .Include(c => c.User)
                .Where(c => !c.IsDeleted && c.Status == "active");

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(c => c.Title.Contains(search));

            var totalItems = await query.CountAsync();

            var data = await query
                .OrderByDescending(c => c.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (data, totalItems);
        }

        public async Task<Course?> GetBySlugAsync(string slug)
        {
            var course = await _context.Courses
                .Include(c => c.Category)
                .Include(c => c.User)
                .Include(c => c.Reviews)
                    .ThenInclude(r => r.User)
                .Include(c => c.Modules)
                    .ThenInclude(m => m.Lessons)
                        .ThenInclude(l => l.CodingProblems)
                .FirstOrDefaultAsync(c => c.Slug == slug && !c.IsDeleted);

            if (course == null) return null;

            // 🔽 Sort sau khi đã load lên RAM
            course.Modules = course.Modules
                .OrderBy(m => m.OrderIndex)
                .ToList();

            foreach (var module in course.Modules)
                module.Lessons = module.Lessons
                    .OrderBy(l => l.OrderIndex)
                    .ToList();

            return course;
        }

        public async Task<Course> CreateAsync(CreateCourseDto createCourseDto)
        {
            Course newCourse = _mapper.Map<Course>(createCourseDto);
            _context.Courses.Add(newCourse);
            await _context.SaveChangesAsync();
            return newCourse;
        }

        public async Task<bool> DeleteAsync(Guid CourseId)
        {
            Course? course = await _context.Courses.FindAsync(CourseId);
            if (course == null) return false;
            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Course>> GetAllAsync(QueryParameters query)
        {
            int limit = query.Limit, page = query.Page;
            return await _context.Courses.Include(c => c.User).Skip(limit * (page - 1)).Take(limit).ToListAsync();
        }

        public async Task<Course?> GetByIdAsync(Guid courseId)
        {
            return await _context.Courses.FindAsync(courseId);
        }

        public async Task<Course?> UpdateAsync(UpdateCourseDto updateCourseDto)
        {
            Course? course = await _context.Courses.FindAsync(updateCourseDto.CourseId);

            if (course == null)
                return null;

            // Map các property từ DTO sang entity đang được track
            _mapper.Map(updateCourseDto, course);

            await _context.SaveChangesAsync();
            return course;
        }

        public async Task<bool> ExistsByTitleAsync(string title)
        {
            Course? course = await _context.Courses.FirstOrDefaultAsync(p => p.Title == title);
            return course != null;
        }
        public async Task<bool> ExistsBySlugAsync(string slug)
        {
            Course? course = await _context.Courses.FirstOrDefaultAsync(c => c.Slug == slug);
            return course != null;
        }
    }
}