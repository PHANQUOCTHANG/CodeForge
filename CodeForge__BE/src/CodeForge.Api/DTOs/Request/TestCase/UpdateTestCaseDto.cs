using CodeForge.Core.Entities;

namespace CodeForge.Api.DTOs
{
    public class UpdateTestCaseDto
    {
        public Guid TestCaseId { get; set; }
        public Guid ProblemId { get; set; }
        public Problem Problem { get; set; }
        public string Input { get; set; }
        public string ExpectedOutput { get; set; }

        public string Explain { get; set; }
        public bool IsHidden { get; set; } = false;
        public int OrderIndex { get; set; } = 0;
        public string InputType { get; set; } = "JSON";
        public float Weight { get; set; } = 1.0f;
    }
}