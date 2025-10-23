using CodeForge.Api.DTOs;
using CodeForge.Api.DTOs.Response;


namespace CodeForge.Core.Interfaces.Services
{
    public interface ITestCaseService
    {
        Task<ApiResponse<List<TestCaseDto>>> GetAllTestCaseAsync(bool? isHiden);
        Task<ApiResponse<TestCaseDto>> GetTestCaseByIdAsync(Guid testCaseId);

        Task<ApiResponse<TestCaseDto>> UpdateTestCaseAsync(UpdateTestCaseDto updateTestCaseDto);
        Task<ApiResponse<TestCaseDto>> CreateTestCaseAsync(CreateTestCaseDto createTestCaseDto);
        Task<ApiResponse<bool>> DeleteTestCaseAsync(Guid testCaseId);
    }
}