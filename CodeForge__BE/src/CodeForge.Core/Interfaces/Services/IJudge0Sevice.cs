using CodeForge.Api.DTOs.Response;

namespace CodeForge.Core.Interfaces.Services
{
    public interface IJudge0Service
    {

        Task<List<Judge0Response>> RunAllTestCasesAsync(
            string language,
            string userCode,
            string functionName,
            List<Guid> testCases);
        Task<Judge0Response> SubmitAsync(string language, string fullCode, string expectedOutput = null);
    }
}