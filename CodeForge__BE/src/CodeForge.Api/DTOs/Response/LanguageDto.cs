namespace CodeForge.Api.DTOs.Response
{
    public class LanguageDto
    {
        public Guid LanguageID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Version { get; set; }
    }
}