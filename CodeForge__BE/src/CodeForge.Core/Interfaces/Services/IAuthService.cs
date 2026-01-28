using CodeForge.Api.DTOs;
using CodeForge.Api.DTOs.Auth;
using CodeForge.Api.DTOs.Request.Auth;
using CodeForge.src.CodeForge.Api.DTOs.Request.Auth;
using CodeForge.src.CodeForge.Api.DTOs.Response.Auth;

namespace CodeForge.Core.Interfaces.Services
{
    public interface IAuthService
    {
        Task<AuthDto> RegisterAsync(RegisterDto request, string ipAddress);
        Task<AuthDto> LoginAsync(LoginDto request, string ipAddress);
        Task<AuthDto> RefreshTokenAsync(string refreshToken, string ipAddress);
        Task RevokeTokenAsync(string refreshToken, string ipAddress);

        // Forgot password flow
        // Returns OTP string only when dev mode enabled by configuration; otherwise returns null.
        Task<(bool Sent, string? OtpForDev)> SendForgotPasswordOtpAsync(string email);

        // Verifies OTP (throws UnauthorizedException if invalid)
        Task VerifyForgotPasswordOtpAsync(string email, string otp);

        // Resets password when OTP is valid, returns AuthDto (logs-in user)
        Task<ResetPasswordResultDto> ResetPasswordAsync(ResetPasswordDto dto);
    }
}