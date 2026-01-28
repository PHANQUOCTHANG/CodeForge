using System.Text;
using System.Security.Cryptography;

namespace CodeForge.src.CodeForge.Api.Helpers
{
    public static class StringExtensions
    {
        public static string Shaa256(this string input)
        {
            using var sha = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(input);
            var hash = sha.ComputeHash(bytes);
            var sb = new StringBuilder(hash.Length * 2);
            foreach (var b in hash) sb.Append(b.ToString("x2"));
            return sb.ToString();
        }
    }
}
