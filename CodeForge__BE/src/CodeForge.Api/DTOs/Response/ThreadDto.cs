namespace CodeForge.Api.DTOs.Response
{
    public class ThreadDto
    {
        public Guid UserID { get; set; }
        public Guid ThreadID { get; set; }
        public string Author { get; set; }
        public string Avatar { get; set; }
        public string Role { get; set; }

        public string Content { get; set; }
        public string Title { get; set; }

        public string TimeAgo { get; set; }          
        public string? ImageUrl { get; set; }
        
        public List<string> Tags { get; set; } = new();

        public int Likes { get; set; }
        public int Comments { get; set; }
        public int Shares { get; set; }
    }
}
