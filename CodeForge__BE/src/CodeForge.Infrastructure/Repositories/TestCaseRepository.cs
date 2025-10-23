using AutoMapper;
using CodeForge.Api.DTOs;
using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CodeForge.Infrastructure.Repositories
{
    public class TestCaseRepository : ITestCaseRepository
    {
        private readonly ApplicationDbContext _context;

        private readonly IMapper _mapper;

        public TestCaseRepository(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<TestCase> CreateAsync(CreateTestCaseDto createTestCaseDto)
        {
            TestCase newTestCase = _mapper.Map<TestCase>(createTestCaseDto);
            _context.TestCases.Add(newTestCase);
            await _context.SaveChangesAsync();
            return newTestCase;
        }

        public async Task<bool> DeleteAsync(Guid testCaseId)
        {
            TestCase? testCase = await _context.TestCases.FindAsync(testCaseId);
            if (testCase == null) return false;
            _context.TestCases.Remove(testCase);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<TestCase>> GetAllAsync(bool? isHiden)
        {
            return isHiden != null ? await _context.TestCases
                .Include(b => b.Problem)
                .Where(t => t.IsHidden == isHiden)
                .Take(3)
                .ToListAsync() : await _context.TestCases
                .Include(b => b.Problem)
                .ToListAsync();
        }

        public async Task<TestCase?> GetByIdAsync(Guid testCaseId)
        {
            return await _context.TestCases.FindAsync(testCaseId);
        }

        public async Task<TestCase?> UpdateAsync(UpdateTestCaseDto updateTestCaseDto)
        {
            TestCase? testCase = await _context.TestCases.FindAsync(updateTestCaseDto.TestCaseId);

            if (testCase == null) return null;

            _mapper.Map(updateTestCaseDto, testCase);
            await _context.SaveChangesAsync();
            return testCase;
        }
    }
}