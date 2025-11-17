namespace CodeForge.Api.DTOs.Request.Thread
{
    public class CreateThreadDto
    {
        public Guid UserID { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string? ImageUrl { get; set; }
        public List<string> Tags { get; set; } = new();
    }
}
