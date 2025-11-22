using CodeForge.Core.Entities;

namespace CodeForge.Api.DTOs
{
    public class UpdateTestCaseDto
    {
        public Guid TestCaseId { get; set; }
        public Guid? ProblemId { get; set; }
        public Problem? Problem { get; set; }
        public string Input { get; set; }
        public string ExpectedOutput { get; set; }

        public string Explain { get; set; }
        public bool IsHidden { get; set; } = false;
      
    }
}