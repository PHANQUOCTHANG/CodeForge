using AutoMapper;
using CodeForge.Api.DTOs.Auth;
using CodeForge.Api.DTOs.Request.Auth;
using CodeForge.Api.DTOs.Response;
using CodeForge.Api.Helpers;
using CodeForge.Core.Entities;
// Giả định bạn có namespace này cho các Custom Exceptions
using CodeForge.Core.Exceptions;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Core.Interfaces.Services;
using CodeForge.src.CodeForge.Api.DTOs.Request.Auth;
using CodeForge.src.CodeForge.Api.DTOs.Response.Auth;
using CodeForge.src.CodeForge.Api.Helpers;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration; // Đảm bảo IConfiguration được dùng
using System;
using System.Threading.Tasks;

namespace CodeForge.Core.Service
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly PasswordHasher<User> _hasher = new();
        private readonly IMapper _mapper;
        private readonly IConfiguration _config;
        private readonly IMemoryCache _cache;
        private readonly ILogger<AuthService> _logger;
        public AuthService(IAuthRepository authRepository, IConfiguration config, IMapper mapper, IMemoryCache cache, ILogger<AuthService> logger)
        {
            _authRepository = authRepository;
            _config = config;
            _mapper = mapper;
            _cache = cache ?? throw new ArgumentNullException(nameof(cache));
            _logger = logger;
        }

        // --- REGISTER ---
        public async Task<AuthDto> RegisterAsync(RegisterDto request, string ipAddress)
        {
            var existing = await _authRepository.GetUserByEmailAsync(request.Email);

            // ✅ SỬA: Thay thế Exception bằng ConflictException
            if (existing != null)
                throw new ConflictException("Email already exists");

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                // Luôn kiểm tra nullability cho HashPassword
                PasswordHash = _hasher.HashPassword(null!, request.Password)
            };

            await _authRepository.AddUserAsync(user);

            var refreshToken = TokenGenerator.GenerateRefreshToken(ipAddress);
            refreshToken.UserId = user.UserId; // 👈 Gắn thủ công liên kết
            await _authRepository.AddRefreshTokenAsync(refreshToken);
            await _authRepository.SaveChangesAsync();

            var jwt = JwtHelper.GenerateJwtToken(user, _config);
            var userProfile = _mapper.Map<UserDto>(user);
            return new AuthDto
            {
                UserInfo = userProfile,
                AccessToken = jwt,
                // ✅ LƯU Ý: Đảm bảo refreshToken.TokenHash ở đây là chuỗi token GỐC, không phải giá trị hash.
                RefreshToken = refreshToken.TokenString
            };
        }

        // --- LOGIN ---
        public async Task<AuthDto> LoginAsync(LoginDto request, string ipAddress)
        {
            Console.WriteLine("======password" + request.Password);
            await _authRepository.ClearExpireToken();
            var user = await _authRepository.GetTrackedUserByEmailAsync(request.Email)
                // ✅ SỬA: Thay thế Exception bằng UnauthorizedException
                ?? throw new UnauthorizedException("Invalid email");

            var result = _hasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
            // ✅ SỬA: Thay thế Exception bằng UnauthorizedException
            if (result == PasswordVerificationResult.Failed)
                throw new UnauthorizedException("Invalid password");

            var jwt = JwtHelper.GenerateJwtToken(user, _config);
            var refreshToken = TokenGenerator.GenerateRefreshToken(ipAddress);
            refreshToken.UserId = user.UserId; // 👈 Gắn thủ công liên kết
            await _authRepository.AddRefreshTokenAsync(refreshToken);
            await _authRepository.SaveChangesAsync();
            var userProfile = _mapper.Map<UserDto>(user);
            return new AuthDto
            {
                UserInfo = userProfile,
                AccessToken = jwt,
                RefreshToken = refreshToken.TokenString
            };
        }

        // --- REFRESH TOKEN ---
        public async Task<AuthDto> RefreshTokenAsync(string refreshToken, string ipAddress)
        {
            //clear expired token
            await _authRepository.ClearExpireToken();
            // ⚡ Giải mã trước khi hash (sửa lỗi %3D)
            var rawToken = Uri.UnescapeDataString(refreshToken);

            var tokenHash = rawToken.Sha256();
            var existingToken = await _authRepository.GetRefreshTokenAsync(tokenHash)
                // ✅ SỬA: Thay thế Exception bằng UnauthorizedException
                ?? throw new UnauthorizedException("Invalid token");

            // ✅ SỬA: Tách riêng việc kiểm tra token bị thu hồi/hết hạn
            if (!existingToken.IsActive)
                throw new UnauthorizedException("Token expired or revoked");

            var newRefreshToken = TokenGenerator.GenerateRefreshToken(ipAddress);

            // Thu hồi token cũ (Token Rotation)
            existingToken.RevokedAt = DateTime.UtcNow;
            existingToken.RevokedByIp = ipAddress;
            existingToken.ReplacedByTokenHash = newRefreshToken.TokenHash;

            // Thêm token mới vào User
            newRefreshToken.UserId = existingToken.UserId; // 👈 Gắn thủ công liên kết
            await _authRepository.AddRefreshTokenAsync(newRefreshToken);

            await _authRepository.SaveChangesAsync();

            var jwt = JwtHelper.GenerateJwtToken(existingToken.User, _config);
            var userProfile = _mapper.Map<UserDto>(existingToken.User);
            return new AuthDto
            {
                UserInfo = userProfile,
                AccessToken = jwt,
                RefreshToken = newRefreshToken.TokenString
            };
        }

        // --- REVOKE TOKEN ---
        public async Task RevokeTokenAsync(string refreshToken, string ipAddress)
        {
            var tokenHash = refreshToken.Sha256();
            var existingToken = await _authRepository.GetRefreshTokenAsync(tokenHash)
                // ✅ SỬA: Thay thế Exception bằng UnauthorizedException
                ?? throw new UnauthorizedException("Invalid token");

            // Nếu token đã bị thu hồi trước đó, không cần làm gì thêm, hoặc có thể ném lỗi 401 tùy logic
            if (existingToken.RevokedAt != null)
                return;

            existingToken.RevokedAt = DateTime.UtcNow;
            existingToken.RevokedByIp = ipAddress;
            await _authRepository.SaveChangesAsync();
        }
        private record PasswordResetEntry(string Email, string OtpHash, DateTime ExpiresAt, DateTime CreatedAt, int Attempts, bool Used);

        private static string CacheKeyForEmail(string email) => $"pwreset:{email.Trim().ToLowerInvariant()}";
        // Helper: set password-reset entry into cache with relative expiration to avoid DateTime timezone / precision issues
        private void SetPasswordResetCache(string key, PasswordResetEntry entry)
        {
            var remaining = entry.ExpiresAt - DateTime.UtcNow;
            var relative = remaining > TimeSpan.Zero ? remaining : TimeSpan.FromMinutes(1);
            var options = new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = relative
            };
            _cache.Set(key, entry, options);
        }

        public async Task<(bool Sent, string? OtpForDev)> SendForgotPasswordOtpAsync(string email)
        {
            email = email.Trim().ToLower(); // ✅ FIX

            var user = await _authRepository.GetUserByEmailAsync(email);
            if (user == null)
                return (false, null); // hoặc throw BadRequestException

            var otp = OtpGenerator.GenerateNumericOtp(6);

            var entry = new PasswordResetEntry(
                Email: email,
                OtpHash: otp.Sha256(),
                ExpiresAt: DateTime.UtcNow.AddMinutes(10),
                CreatedAt: DateTime.UtcNow,
                Attempts: 0,
                Used: false
            );

            var key = CacheKeyForEmail(email);
            SetPasswordResetCache(key, entry);

            Console.WriteLine($"[PASSWORD RESET OTP] Email={email}, OTP={otp}");

            var returnInDev = string.Equals(
                _config["App:ReturnOtpForDev"], "true", StringComparison.OrdinalIgnoreCase
            );

            return (true, returnInDev ? otp : null);
        }
        public async Task VerifyForgotPasswordOtpAsync(string email, string otp)
        {
            email = email.Trim().ToLower();
            var key = CacheKeyForEmail(email);

            if (!_cache.TryGetValue<PasswordResetEntry>(key, out var existing))
                throw new UnauthorizedException("Invalid or expired OTP");

            if (existing.Used || existing.ExpiresAt < DateTime.UtcNow)
                throw new UnauthorizedException("Invalid or expired OTP");

            if (existing.Attempts >= 5)
                throw new UnauthorizedException("OTP attempts exceeded");

            if (existing.OtpHash != otp.Sha256())
            {
                var updated = existing with { Attempts = existing.Attempts + 1 };
                SetPasswordResetCache(key, updated);
                throw new UnauthorizedException("Invalid OTP");
            }

            // ✅ CHỈ VERIFY – KHÔNG ĐÁNH DẤU USED
            _logger.LogInformation(
                "VERIFY_OTP | SUCCESS | Email={Email}",
                email
            );
        }
        public async Task<ResetPasswordResultDto> ResetPasswordAsync(
    ResetPasswordDto request)
        {
            var email = request.Email.Trim().ToLower();
            var otp = request.Otp.Trim();
            var key = CacheKeyForEmail(email);

            if (!_cache.TryGetValue<PasswordResetEntry>(key, out var existing))
                throw new BadRequestException("Invalid or expired OTP");

            if (existing.Used)
                throw new BadRequestException("OTP already used");

            if (existing.ExpiresAt < DateTime.UtcNow)
                throw new BadRequestException("OTP expired");

            if (existing.OtpHash != otp.Sha256())
                throw new BadRequestException("Invalid OTP");

            var user = await _authRepository.GetTrackedUserByEmailAsync(email)
                ?? throw new BadRequestException("Invalid email");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(
                request.NewPassword,
                workFactor: 12
            );

            SetPasswordResetCache(key, existing with { Used = true });
            await _authRepository.SaveChangesAsync();

            _logger.LogInformation(
                "RESET_PW | SUCCESS | Email={Email} | UserId={UserId}",
                email,
                user.UserId
            );

            return new ResetPasswordResultDto(
                Success: true,
                Message: "Password reset successfully. Please login again."
            );
        }
    }
}