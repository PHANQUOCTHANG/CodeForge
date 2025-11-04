

public class RunProblemDto
{
    public Guid UserId { get; set; }
    public Guid ProblemId { get; set; }
    public string? Code { get; set; }
    public string? Language { get; set; }
    public string? FunctionName { get; set; }
    public List<Guid>? TestCases { get; set; }
}