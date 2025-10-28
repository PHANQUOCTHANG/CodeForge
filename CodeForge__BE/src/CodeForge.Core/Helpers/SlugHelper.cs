// Core/Helpers/SlugHelper.cs
using System.Text;
using System.Text.RegularExpressions;

namespace CodeForge.Core.Helpers
{
    public static class SlugHelper
    {
        public static string GenerateSlug(string title)
        {
            string slug = title.ToLower().Trim();
            slug = Regex.Replace(slug, @"[^a-z0-9\s-]", "");   // bỏ ký tự đặc biệt
            slug = Regex.Replace(slug, @"\s+", "-");           // thay khoảng trắng = "-"
            slug = Regex.Replace(slug, "-{2,}", "-");          // bỏ trùng "-"
            return slug;
        }
    }
}
