using CodeForge.Api.DTOs.Auth;
using CodeForge.Api.DTOs.Request.Auth;
using CodeForge.Api.Helpers;
using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Core.Interfaces.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading.Tasks;
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
        private readonly IEmailService _emailService;

        public AuthService(IAuthRepository authRepository, IConfiguration config, IMapper mapper, IEmailService emailService)
        {
            _authRepository = authRepository;
            _config = config;
            _mapper = mapper;
            _emailService = emailService;
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

        // ============================
        // SEND OTP
        // ============================
        public async Task SendOtpAsync(string email)
        {
            // Kiểm tra email tồn tại
            var user = await _authRepository.GetUserByEmailAsync(email);
            if (user == null)
                throw new Exception("Email không tồn tại trong hệ thống");

            // Sinh OTP 6 chữ số
            var otpCode = GenerateOtpCode();

            // Tạo object OTP
            var otp = new Otp(email, otpCode);

            // Lưu OTP vào database
            await _authRepository.AddOtpAsync(otp);
            await _authRepository.SaveChangesAsync();

            // Gửi email
            try
            {
                await _emailService.SendOtpEmailAsync(email, otpCode);
            }
            catch (Exception ex)
            {
                throw new Exception($"Lỗi gửi email: {ex.Message}");
            }
        }

        // ============================
        // VERIFY OTP
        // ============================
        public async Task<string> VerifyOtpAsync(string email, string otp)
        {
            // Lấy OTP gần nhất từ database
            var latestOtp = await _authRepository.GetLatestOtpByEmailAsync(email);

            if (latestOtp == null)
                throw new Exception("OTP không tồn tại");

            // Kiểm tra OTP đã được sử dụng chưa
            if (latestOtp.IsUsed)
                throw new Exception("OTP đã được sử dụng");

            // Kiểm tra OTP có hợp lệ không (chưa hết hạn)
            if (!latestOtp.IsValid())
                throw new Exception("OTP đã hết hạn");

            // Kiểm tra mã OTP có khớp không
            if (latestOtp.Code != otp)
                throw new UnauthorizedException("OTP không hợp lệ");

            // Đánh dấu OTP là đã được sử dụng
            latestOtp.IsUsed = true;
            latestOtp.UsedAt = DateTime.UtcNow;
            await _authRepository.UpdateOtpAsync(latestOtp);

            // Tạo Reset Token
            var resetToken = GenerateResetToken();
            var resetTokenEntity = new ResetToken(email, resetToken);
            await _authRepository.AddResetTokenAsync(resetTokenEntity);

            await _authRepository.SaveChangesAsync();

            return resetToken;
        }

        // ============================
        // RESET PASSWORD
        // ============================
        public async Task ResetPasswordAsync(string email, string resetToken, string newPassword)
        {
            // 1. Kiểm tra reset token
            var token = await _authRepository.GetResetTokenAsync(resetToken);
            if (token == null)
                throw new UnauthorizedException("Reset token không hợp lệ");

            if (!token.IsValid())
                throw new UnauthorizedException("Reset token đã hết hạn");

            if (!string.Equals(token.Email, email, StringComparison.OrdinalIgnoreCase))
                throw new UnauthorizedException("Email không khớp với reset token");

            // 2. Lấy user
            var user = await _authRepository.GetUserByEmailForUpdateAsync(email);
            if (user == null)
                throw new Exception("User không tồn tại");

            // 3. Hash mật khẩu mới bằng BCrypt ✅
            var newPasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);

            // 4. Cập nhật mật khẩu
            user.PasswordHash = newPasswordHash;
            _authRepository.UpdateUserPassword(user);

            // 5. Đánh dấu token đã dùng
            token.IsUsed = true;
            token.UsedAt = DateTime.UtcNow;
            await _authRepository.UpdateResetTokenAsync(token);

            // 6. Lưu DB
            await _authRepository.SaveChangesAsync();
        }


        // ============================
        // Helper Methods
        // ============================
        private string GenerateOtpCode()
        {
            var random = new Random();
            var otp = random.Next(100000, 999999).ToString();
            return otp;
        }

        private string GenerateResetToken()
        {
            // Sinh token 32 ký tự ngẫu nhiên (base64)
            var randomBytes = new byte[24];
            using (var rng = System.Security.Cryptography.RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
            }
            return Convert.ToBase64String(randomBytes);
        }
    }
}