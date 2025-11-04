using AutoMapper;
using CodeForge.Api.DTOs.Request;
using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CodeForge.Infrastructure.Repositories
{
    public class SubmissionRepository : ISubmissionRepository
    {
        private readonly ApplicationDbContext _context;

        private readonly IMapper _mapper;

        public SubmissionRepository(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Submission> CreateAsync(CreateSubmissionDto createSubmissionDto)
        {
            Submission submission = _mapper.Map<Submission>(createSubmissionDto);
            _context.Submissions.Add(submission);
            await _context.SaveChangesAsync();
            return submission;
        }

        public async Task<List<Submission>> GetAllAsync()
        {
            return await _context.Submissions
                .Include(s => s.User)
                .Include(s => s.Problem)
                .Include(s => s.TestCase)
                .ToListAsync();
        }

        public async Task<List<Submission>> GetByIdAsync(Guid problemId, Guid userId)
        {
            return await _context.Submissions
                .Include(s => s.User)
                .Include(s => s.Problem)
                .Include(s => s.TestCase)
                .Where(s => s.ProblemId == problemId && s.UserId == userId)
                .ToListAsync();
        }
    }
}