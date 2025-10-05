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
            Problem newProblem = _mapper.Map<Problem>(createProblemDto);
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

        public async Task<List<Problem>> GetAllAsync()
        {
            return await _context.CodingProblems.Include(l => l.Lesson).ToListAsync();
        }

        public async Task<Problem?> GetByIdAsync(Guid problemId)
        {
            return await _context.CodingProblems.FindAsync(problemId);
        }

        public async Task<Problem?> UpdateAsync(UpdateProblemDto updateProblemDto)
        {
            Problem? problem = await _context.CodingProblems.FindAsync(updateProblemDto.ProblemId);

            if (problem == null) return null;

            _mapper.Map(updateProblemDto, problem);
            await _context.SaveChangesAsync();
            return problem;
        }

        public async Task<bool> ExistsByTitle(string title)
        {
            Problem? problem = await _context.CodingProblems.FirstOrDefaultAsync(p => p.Title == title);
            return problem != null;
        }
    }
}