using System.Security.Cryptography;

using CodeForge.Core.Entities;

namespace CodeForge.Api.Helpers;

public static class TokenGenerator
{
    public static RefreshToken GenerateRefreshToken(string ipAddress)
    {
        var randomBytes = RandomNumberGenerator.GetBytes(64);
        var tokenString = Convert.ToBase64String(randomBytes);

        return new RefreshToken
        {
            // ✅ SỬA: Lưu chuỗi token gốc vào thuộc tính mới (hoặc tạm thời)
            TokenString = tokenString,
            // LƯU VÀO DB: Lưu giá trị băm (hash)
            TokenHash = tokenString.Sha256(),
            ExpiresAt = DateTime.UtcNow.AddDays(30),
            CreatedAt = DateTime.UtcNow,
            CreatedByIp = ipAddress
        };
    }
}
