using System;
using CodeForge.Core.Entities;

namespace CodeForge.Api.DTOs.Response
{
    public class SubmissionDto
    {
        public Guid SubmissionId { get; set; }
        public Guid UserId { get; set; }
        public Guid ProblemId { get; set; }

        public string Code { get; set; } = string.Empty;
        public string Language { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;

        public DateTime SubmitTime { get; set; }

        public int ExecutionTime { get; set; }
        public int MemoryUsed { get; set; }
        public int QuantityTestPassed { get; set; }
        public int QuantityTest { get; set; }

        public Guid? TestCaseIdFail { get; set; }
        public User? User { get; set; }
        public Problem? Problem { get; set; }
        public TestCase? TestCase { get; set; }



    }
}
