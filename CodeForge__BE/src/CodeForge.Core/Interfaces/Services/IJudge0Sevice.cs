using CodeForge.Api.DTOs.Response;

namespace CodeForge.Core.Interfaces.Services
{
    public interface IJudge0Service
    {

        Task<List<Judge0Response>> RunAllTestCasesAsync(
            string language,
            string userCode,
            string functionName,
            List<Guid> testCases, Guid problemId);
        Task<Judge0Response> SubmitAsync(string language, string fullCode, Guid testCaseId, string expectedOutput , int timeLimit , int memory);

        Task<Object> SubmitProblem(Guid userId ,Guid problemId, string language, string userCode, string functionName);
    }
}