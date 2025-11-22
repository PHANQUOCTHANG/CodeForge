using CodeForge.Api.DTOs;
using CodeForge.Api.DTOs.Auth;
using CodeForge.Api.DTOs.Request.Auth;
using CodeForge.Core.Exceptions;
using CodeForge.Core.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration; // 👈 Nhớ import cái này
namespace CodeForge.Api.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IConfiguration _configuration; // 👈 Inject Configuration
        public AuthController(IAuthService authService, IConfiguration configuration)
        {
            _authService = authService;
            _configuration = configuration;
        }
        
        // ============================
        // LOGIN
        // ============================
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            Console.WriteLine($"Email: {loginDto?.Email}, Password: {loginDto?.Password}");

            // KHÔNG CẦN try-catch. Global Middleware sẽ bắt các UnauthorizedException/ConflictException
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            var result = await _authService.LoginAsync(loginDto, ip);

            if (!string.IsNullOrEmpty(result.RefreshToken))
                SetRefreshCookie(result.RefreshToken);

            return Ok(ApiResponse<AuthDto>.Success(result, "Đăng nhập thành công"));
        }

        // ============================
        // REGISTER
        // ============================
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            // KHÔNG CẦN try-catch. Logic thành công được giữ lại.
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            var result = await _authService.RegisterAsync(registerDto, ip);

            if (!string.IsNullOrEmpty(result.RefreshToken))
                SetRefreshCookie(result.RefreshToken);

            // Thường sử dụng Created (201) cho đăng ký thành công
            return CreatedAtAction(nameof(Login), new { email = registerDto.Email },
                ApiResponse<AuthDto>.Created(result, "Đăng ký thành công"));
        }
       
        // ============================
        // REFRESH TOKEN
        // ============================
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];

            // Đây là kiểm tra cơ bản, không phải lỗi nghiệp vụ từ Service
            if (string.IsNullOrEmpty(refreshToken))
                return Unauthorized(ApiResponse<string>.Fail("Refresh token missing"));

            // KHÔNG CẦN try-catch. Nếu token không hợp lệ (Invalid token/Expired), 
            // AuthService sẽ ném UnauthorizedException và Middleware sẽ bắt.
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            var result = await _authService.RefreshTokenAsync(refreshToken, ip);

            if (!string.IsNullOrEmpty(result.RefreshToken))
                SetRefreshCookie(result.RefreshToken);

            return Ok(ApiResponse<AuthDto>.Success(result, "Làm mới token thành công"));
        }

        // ============================
        // LOGOUT
        // ============================
        // Trong AuthController.cs

        // ============================
        // LOGOUT
        // ============================
        [Authorize]
        [HttpPost("log-out")]
        public async Task<IActionResult> Logout()
        {
            var refreshToken = Request.Cookies["refreshToken"];

            // 1. Chỉ thực hiện Revoke nếu Refresh Token tồn tại trong Cookie
            if (!string.IsNullOrEmpty(refreshToken))
            {
                var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

                // Bắt lỗi khi token đã bị vô hiệu hóa
                try
                {
                    // Cố gắng thu hồi token trong DB.
                    await _authService.RevokeTokenAsync(refreshToken, ip);
                }
                catch (UnauthorizedException)
                {
                    // ✅ XỬ LÝ LỖI IM LẶNG: Nếu AuthService ném UnauthorizedException 
                    // (vì token không hợp lệ, hết hạn, hoặc đã bị thu hồi), 
                    // chúng ta bỏ qua lỗi này và tiếp tục xóa cookie.
                    // Mục tiêu của Logout đã đạt được: phiên người dùng kết thúc.
                }
                // Các lỗi khác (như lỗi DB, Exception chung) vẫn sẽ được Global Handler bắt
            }

            // 2. Luôn xóa cookie khỏi trình duyệt (Bước quan trọng nhất)
            Response.Cookies.Delete("refreshToken");

            // ✅ Trả về 200 OK
            return Ok(ApiResponse<string>.Success("Đăng xuất thành công"));
        }
        // POST: api/auth/register/admin/{secret}
        // SỬA CONTROLLER CỦA BẠN NHƯ SAU:

        [HttpPost("register/admin/{secret}")] // {secret} ở đây là Route Parameter
        public async Task<IActionResult> RegisterForAdmin(
            [FromBody] RegisterDto registerDto, 
            [FromRoute] string secret // <--- ĐỔI TỪ [FromQuery] SANG [FromRoute]
        )
        {
            // 1. Lấy Secret Key từ cấu hình
            var validSecret = _configuration["AdminSettings:SecretKey"]; // Đảm bảo key này có trong appsettings.json

            // 2. Kiểm tra bảo mật
            // So sánh secret trên URL với secret trong file config
            if (string.IsNullOrEmpty(validSecret) || secret != validSecret)
            {
                return StatusCode(403, ApiResponse<string>.Fail("Truy cập bị từ chối. Mã bí mật không đúng."));
            }

            // 3. Lấy IP
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

            // 4. ⚡ CƯỠNG ÉP ROLE THÀNH ADMIN ⚡
            registerDto.Role = "admin"; 

            // 5. Gọi Service đăng ký
            try 
            {
                var result = await _authService.RegisterAsync(registerDto, ip);

                if (!string.IsNullOrEmpty(result.RefreshToken))
                    SetRefreshCookie(result.RefreshToken);

                // Lưu ý: CreatedAtAction trỏ về Login thường lệ
                return CreatedAtAction(nameof(Login), new { email = registerDto.Email },
                    ApiResponse<AuthDto>.Created(result, "Đăng ký Admin thành công"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<string>.Fail(ex.Message));
            }
        }
        // ============================
        // Helper: Set Refresh Cookie (Giữ nguyên)
        // ============================
        private void SetRefreshCookie(string refreshToken)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.Lax, // 👈 đổi None → Lax
                Secure = false, // tạm thời cho localhost, production thì phải true
                Expires = DateTime.UtcNow.AddDays(30)
            };
            Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
        }
    }
}