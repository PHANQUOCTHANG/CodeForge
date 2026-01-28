using System.Security.Cryptography;

namespace CodeForge.src.CodeForge.Api.Helpers
{
    public class OtpGenerator
    {
        public static string GenerateNumericOtp(int length = 6)
        {
            const string digits = "0123456789";
            var bytes = RandomNumberGenerator.GetBytes(length);
            var chars = new char[length];
            for (int i = 0; i < length; i++)
            {
                chars[i] = digits[bytes[i] % digits.Length];
            }
            return new string(chars);
        }
    }
}
