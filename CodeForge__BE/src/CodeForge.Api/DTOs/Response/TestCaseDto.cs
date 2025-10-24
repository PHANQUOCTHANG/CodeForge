
using CodeForge.Core.Entities;

namespace CodeForge.Api.DTOs.Response
{
    public class TestCaseDto
    {
        public Guid TestCaseId { get; set; } = Guid.NewGuid();
        public Guid ProblemId { get; set; }
        public Problem? Problem { get; set; }
        public string? Input { get; set; }
        public string? ExpectedOutput { get; set; }

        public string? Explain { get; set; }
        public bool IsHidden { get; set; } = false;
        public int OrderIndex { get; set; } = 0;
        public string? InputType { get; set; }
        public float Weight { get; set; } = 1.0f;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
