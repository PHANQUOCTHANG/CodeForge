using CodeForge.Api.DTOs;
using CodeForge.Core.Entities;

namespace CodeForge.Core.Interfaces.Repositories
{
    public interface ITestCaseRepository
    {
        Task<List<TestCase>> GetAllAsync();
        Task<List<TestCase>> GetAllByProblemIdAsync(bool? isHidden , Guid problemId);
        Task<TestCase?> GetByIdAsync(Guid testCaseId);

        Task<TestCase?> UpdateAsync(UpdateTestCaseDto updateTestCaseDto);
        Task<TestCase> CreateAsync(CreateTestCaseDto createTestCaseDto);

        Task<bool> DeleteAsync(Guid testCaseId);
    }
}