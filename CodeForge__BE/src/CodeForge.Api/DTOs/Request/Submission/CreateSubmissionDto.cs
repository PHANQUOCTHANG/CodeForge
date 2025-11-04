
using System.ComponentModel.DataAnnotations;

namespace CodeForge.Api.DTOs.Request
{
    public class CreateSubmissionDto
    {
        public Guid UserId { get; set; }
        public Guid ProblemId { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Language { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public int ExecutionTime { get; set; } = 0;
        public int MemoryUsed { get; set; } = 0;
        public int QuantityTestPassed { get; set; } = 0;
        public int QuantityTest { get; set; } = 0;
        public Guid? TestCaseIdFail { get; set; }
        public CreateSubmissionDto(
            Guid userId,
            Guid problemId,
            string code,
            string language,
            string status,
            int executionTime = 0,
            int memoryUsed = 0,
            int quantityTestPassed = 0,
            int quantityTest = 0, Guid? testCaseIdFail = null)
        {
            UserId = userId;
            ProblemId = problemId;
            Code = code;
            Language = language;
            Status = status;
            ExecutionTime = executionTime;
            MemoryUsed = memoryUsed;
            QuantityTestPassed = quantityTestPassed;
            QuantityTest = quantityTest;
            TestCaseIdFail = testCaseIdFail;
        }
    }
}
