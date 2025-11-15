using AutoMapper;
using CodeForge.Api.DTOs;
using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CodeForge.Infrastructure.Repositories
{
    public class ProblemRepository : IProblemRepository
    {
        private readonly ApplicationDbContext _context;

        private readonly IMapper _mapper;

        public ProblemRepository(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Problem> CreateAsync(CreateProblemDto createProblemDto)
        {
            createProblemDto.Slug = SlugGenerator.ConvertTitleToSlug(createProblemDto.Title);
            Problem newProblem = _mapper.Map<Problem>(createProblemDto);
            newProblem.ProblemId = Guid.NewGuid(); // ép lại trước khi lưu
            _context.CodingProblems.Add(newProblem);
            await _context.SaveChangesAsync();
            return newProblem;
        }

        public async Task<bool> DeleteAsync(Guid problemId)
        {
            Problem? problem = await _context.CodingProblems.FindAsync(problemId);
            if (problem == null) return false;
            _context.CodingProblems.Remove(problem);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Problem>> GetAllAsync(QueryParameters queryParameters)
        {
            return await _context.CodingProblems
                    // .Skip((queryParameters.Page - 1) * queryParameters.Limit)
                    // .Take(queryParameters.Limit)
                .Include(l => l.Lesson)
                .ToListAsync();
        }

        public async Task<Problem?> GetByIdAsync(Guid problemId)
        {
            return await _context.CodingProblems.FindAsync(problemId);
        }


        public async Task<Problem?> GetBySlugAsync(string slug) 
        {
            return await _context.CodingProblems.FirstOrDefaultAsync(p => p.Slug == slug);
        }

        public async Task<Problem?> UpdateAsync(UpdateProblemDto updateProblemDto)
        {
            Problem? problem = await _context.CodingProblems.FindAsync(updateProblemDto.ProblemId);

            if (problem == null) return null;

            updateProblemDto.Slug = SlugGenerator.ConvertTitleToSlug(updateProblemDto.Title);

            _mapper.Map(updateProblemDto, problem);

            await _context.SaveChangesAsync();
            return problem;
        }

        public async Task<bool> ExistsByTitle(string title , Guid problemId)
        {
            Problem? problem = await _context.CodingProblems.FirstOrDefaultAsync(p => p.Title == title && p.ProblemId != problemId);
            return problem != null;
        }
    }
}