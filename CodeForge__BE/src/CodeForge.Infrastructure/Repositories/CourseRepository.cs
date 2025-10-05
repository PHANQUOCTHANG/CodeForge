
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

        public async Task<bool> ExistsByTitle(string title)
        {
            Course? course = await _context.Courses.FirstOrDefaultAsync(p => p.Title == title);
            return course != null;
        }
    }
}