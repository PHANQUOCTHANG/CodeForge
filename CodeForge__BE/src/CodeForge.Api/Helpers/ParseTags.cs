using System.Text.Json;

namespace CodeForge.Api.Helpers
{
    public static class JsonHelper
    {
        /// <summary>
        /// Parse JSON string sang List<string>, return empty list nếu null hoặc lỗi.
        /// </summary>
        public static List<string> ParseTags(string? json)
        {
            if (string.IsNullOrEmpty(json)) return new List<string>();
            try
            {
                return JsonSerializer.Deserialize<List<string>>(json) ?? new List<string>();
            }
            catch
            {
                return new List<string>();
            }
        }
    }
}
