using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

public static class SlugGenerator
{
    public static string ConvertTitleToSlug(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
            return string.Empty;

        // 1️⃣ Chuẩn hóa chuỗi để tách dấu (ví dụ: "á" -> "a" + "́")
        string normalized = title.Normalize(NormalizationForm.FormD);

        // 2️⃣ Loại bỏ dấu tiếng Việt
        var sb = new StringBuilder();
        foreach (char c in normalized)
        {
            if (CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
                sb.Append(c);
        }

        string slug = sb.ToString().Normalize(NormalizationForm.FormC);

        // 3️⃣ Xử lý chữ đặc biệt "đ" và "Đ"
        slug = slug.Replace('đ', 'd').Replace('Đ', 'd');

        // 4️⃣ Chuyển về chữ thường
        slug = slug.ToLowerInvariant();

        // 5️⃣ Loại bỏ ký tự đặc biệt, chỉ giữ lại chữ, số, khoảng trắng và dấu '-'
        slug = Regex.Replace(slug, @"[^a-z0-9\s-]", "");

        // 6️⃣ Thay khoảng trắng bằng dấu '-'
        slug = Regex.Replace(slug, @"\s+", "-");

        // 7️⃣ Loại bỏ dấu '-' thừa (nhiều dấu liền nhau)
        slug = Regex.Replace(slug, @"-+", "-");

        // 8️⃣ Xóa dấu '-' ở đầu hoặc cuối
        slug = slug.Trim('-');

        return slug;
    }
}
