namespace CodeForge.Api.DTOs.Response
{
    public class ProfileDto
    {
        public Guid ProfileID { get; set; }

        public Guid UserID { get; set; }

        public string? FullName { get; set; }

        public string? Avatar { get; set; }

        public string? Bio { get; set; }

        public string? Country { get; set; }

        public int Points { get; set; }

        public int Level { get; set; }

        public bool IsDeleted { get; set; }
    }
}
