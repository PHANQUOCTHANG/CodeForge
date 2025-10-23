using CodeForge.Core.Entities;

namespace CodeForge.Api.DTOs
{
    public class CreateTestCaseDto
    {
        public Guid ProblemId { get; set; }
        public string Input { get; set; }
        public string ExpectedOutput { get; set; }
        public bool IsHidden { get; set; } = false;
        public string Explain { get; set; } = string.Empty;
        // public int OrderIndex { get; set; } = 0;
        // public string InputType { get; set; } = "JSON";
        // public float Weight { get; set; } = 1.0f;
    }
}