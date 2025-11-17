using CodeForge.Api.DTOs;
using CodeForge.Api.DTOs.Response;


namespace CodeForge.Core.Interfaces.Services
{
    public interface ITestCaseService
    {
        Task<List<TestCaseDto>> GetAllTestCaseAsync();
        Task<List<TestCaseDto>> GetAllTestCaseByProblemIdAsync(bool? isHidden , Guid problemId);
        Task<TestCaseDto> GetTestCaseByIdAsync(Guid testCaseId);

        Task<TestCaseDto> UpdateTestCaseAsync(UpdateTestCaseDto updateTestCaseDto);
        Task<TestCaseDto> CreateTestCaseAsync(CreateTestCaseDto createTestCaseDto);

        Task<List<TestCaseDto>> CreateManyTestCaseAsync(List<CreateTestCaseDto> createTestCaseDtos);
        Task<bool> DeleteTestCaseAsync(Guid testCaseId);
    }
}