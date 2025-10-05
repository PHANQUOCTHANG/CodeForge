public class QueryParameters
{
    public int Page { get; set; } = 1;
    public int Limit { get; set; } = 10;
    public string? Search { get; set; }
    public string? SortBy { get; set; } = "CreatedAt";
    public string? Order { get; set; } = "desc"; // asc / desc
    public string? Status { get; set; }
}
