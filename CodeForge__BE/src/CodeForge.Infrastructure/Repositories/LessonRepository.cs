using AutoMapper;
using CodeForge.Api.DTOs;
using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CodeForge.Infrastructure.Repositories
{
    public class LessonRepository : ILessonRepository
    {
        private readonly ApplicationDbContext _context;

        private readonly IMapper _mapper;

        public LessonRepository(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Lesson> CreateAsync(CreateLessonDto createLessonDto)
        {
            Lesson newLesson = _mapper.Map<Lesson>(createLessonDto);
            _context.Lessons.Add(newLesson);
            await _context.SaveChangesAsync();
            return newLesson;
        }

        public async Task<bool> DeleteAsync(Guid lessonId)
        {
            Lesson? lesson = await _context.Lessons.FindAsync(lessonId);
            if (lesson == null) return false;
            _context.Lessons.Remove(lesson);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Lesson>> GetAllAsync()
        {
            return await _context.Lessons.Include(m => m.Module).ToListAsync();
        }

        public async Task<Lesson?> GetByIdAsync(Guid lessonId)
        {
            return await _context.Lessons.FindAsync(lessonId);
        }

        public async Task<Lesson?> UpdateAsync(UpdateLessonDto updateLessonDto)
        {
            Lesson? lesson = await _context.Lessons.FindAsync(updateLessonDto.LessonId);

            if (lesson == null) return null;

            _mapper.Map(updateLessonDto, lesson);
            await _context.SaveChangesAsync();
            return lesson;
        }

        public async Task<bool> ExistsByTitle(string title)
        {
            Lesson? lesson = await _context.Lessons.FirstOrDefaultAsync(p => p.Title == title);
            return lesson != null;
        }
    }
}