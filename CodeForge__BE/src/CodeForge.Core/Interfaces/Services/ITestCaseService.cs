using CodeForge.Api.DTOs;
using CodeForge.Api.DTOs.Response;


namespace CodeForge.Core.Interfaces.Services
{
    public interface ITestCaseService
    {
        Task<List<TestCaseDto>> GetAllTestCaseAsync(bool? isHiden);
        Task<TestCaseDto> GetTestCaseByIdAsync(Guid testCaseId);

        Task<TestCaseDto> UpdateTestCaseAsync(UpdateTestCaseDto updateTestCaseDto);
        Task<TestCaseDto> CreateTestCaseAsync(CreateTestCaseDto createTestCaseDto);
        Task<bool> DeleteTestCaseAsync(Guid testCaseId);
    }
}