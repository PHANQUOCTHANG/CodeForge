using CodeForge.Api.DTOs.Auth;
using CodeForge.Api.DTOs.Request.Auth;
using CodeForge.Api.Helpers;
using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Core.Interfaces.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration; // Đảm bảo IConfiguration được dùng
using System;
using System.Threading.Tasks;

// Giả định bạn có namespace này cho các Custom Exceptions
using CodeForge.Core.Exceptions;
using AutoMapper;
using CodeForge.Api.DTOs.Response;

namespace CodeForge.Core.Service
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly PasswordHasher<User> _hasher = new();
        private readonly IMapper _mapper;

        private readonly IConfiguration _config;

        public AuthService(IAuthRepository authRepository, IConfiguration config, IMapper mapper)
        {
            _authRepository = authRepository;
            _config = config;
            _mapper = mapper;
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
                Role = request.Role?.ToLower() == "admin" ? "admin" : "student",
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
    }
}