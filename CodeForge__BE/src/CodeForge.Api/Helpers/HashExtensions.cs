using System.Security.Cryptography;
using System.Text;

namespace CodeForge.Api.Helpers;

public static class HashExtensions
{
    public static string Sha256(this string input)
    {
        using var sha = SHA256.Create();
        var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(input));
        return Convert.ToHexString(bytes);
    }
}
