namespace CodeForge.Core.Settings
{
    /// <summary>
    /// Chứa các thông tin credentials để kết nối với Cloudinary API.
    /// </summary>
    public class CloudinarySettings
    {
        public const string SectionName = "CloudinarySettings"; // Tên section trong appsettings

        public string CloudName { get; set; } = string.Empty;
        public string ApiKey { get; set; } = string.Empty;
        public string ApiSecret { get; set; } = string.Empty;
    }
}