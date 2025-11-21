using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using CodeForge.Api.DTOs;
using CodeForge.Api.DTOs.Request.Comment;
using CodeForge.Api.DTOs.Request.Thread;
using CodeForge.Api.DTOs.Response;
using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Services;
using CodeForge.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace CodeForge.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThreadController : ControllerBase
    {
        private readonly IThreadService _service;
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<ThreadController> _logger;

        public ThreadController(IThreadService service, ApplicationDbContext context, IConfiguration configuration, ILogger<ThreadController> logger)
        {
            _service = service;
            _context = context;
            _configuration = configuration;
            _logger = logger;
        }

        /// <summary>
        /// Lấy tất cả threads
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var threads = await _service.GetAllAsync();
            return Ok(threads);
        }

        /// <summary>
        /// Lấy thread theo ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var thread = await _service.GetByIdAsync(id);
            if (thread == null) 
                return NotFound(new { message = "Thread not found" });
            
            return Ok(thread);
        }

        /// <summary>
        /// Tạo thread mới
        /// </summary>
        [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateThreadDto dto)
    {
        Guid finalUserId;
        
        var authHeader = HttpContext.Request.Headers["Authorization"].ToString();
        
        if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
        {
            var token = authHeader.Substring("Bearer ".Length).Trim();
            var userId = ValidateTokenAndGetUserId(token);
            
            if (userId.HasValue)
            {
                // User đã login -> dùng ID từ token
                finalUserId = userId.Value;
            }
            else
            {
                // Token không hợp lệ -> guest post
                finalUserId = dto.UserID;
            }
        }
        else
        {
            // Không có token -> guest post
            if (dto.UserID == Guid.Empty)
            {
                return BadRequest(new { message = "UserID required for guest posts" });
            }
            finalUserId = dto.UserID;
        }
        
        var serviceDto = new CreateThreadDto
        {
            UserID = finalUserId,
            Title = dto.Title,
            Content = dto.Content,
            ImageUrl = dto.ImageUrl,
            Tags = dto.Tags
        };
        
        var newThread = await _service.CreateAsync(serviceDto);
        return Ok(newThread);
    }


        /// <summary>
        /// Xóa thread (soft delete)
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id, [FromBody] DeleteThreadDto dto)
        {
            _logger.LogInformation($"=== DELETE REQUEST for Thread: {id} ===");

            Guid requestUserId;
            
            // --- BẮT ĐẦU LOGIC XÁC THỰC LINH HOẠT (Giống Create) ---
            var authHeader = HttpContext.Request.Headers["Authorization"].ToString();
            
            // 1. Kiểm tra Token
            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
            {
                var token = authHeader.Substring("Bearer ".Length).Trim();
                
                // ❌ PHẢI CÓ: Thay thế bằng hàm thực tế của bạn
                var userId = ValidateTokenAndGetUserId(token); 
                
                if (userId.HasValue)
                {
                    // ✅ User đã login -> dùng ID từ token (Ưu tiên)
                    requestUserId = userId.Value;
                    _logger.LogInformation($"Using UserID from token: {requestUserId}");
                }
                else
                {
                    // Token không hợp lệ -> Dùng UserID từ body
                    if (dto == null || dto.UserID == Guid.Empty)
                    {
                        return BadRequest(new { message = "UserID required when token is invalid or missing body" });
                    }
                    requestUserId = dto.UserID;
                    _logger.LogInformation($"Token invalid, using UserID from request body: {requestUserId}");
                }
            }
            else
            {
                // ❌ Không có token -> Dùng UserID từ body (Guest delete)
                if (dto == null || dto.UserID == Guid.Empty)
                {
                    return BadRequest(new { message = "UserID required when not authenticated" });
                }
                requestUserId = dto.UserID;
                _logger.LogInformation($"No token, using UserID from request body: {requestUserId}");
            }
            // --- KẾT THÚC LOGIC XÁC THỰC LINH HOẠT ---

            // 2. Lấy thread từ database
            var thread = await _service.GetByIdAsync(id);
            
            if (thread == null)
            {
                _logger.LogWarning($"Thread {id} not found");
                return NotFound(new { message = "Thread not found" });
            }
            
            _logger.LogInformation($"Thread Owner: {thread.UserID}, Request User: {requestUserId}");

            // 3. Kiểm tra quyền sở hữu
            if (thread.UserID != requestUserId)
            {
                _logger.LogWarning($"User {requestUserId} tried to delete thread owned by {thread.UserID}");
                return StatusCode(403, new { message = "You can only delete your own threads" });
            }
            
            // 4. Xóa thread
            try
            {
                await _service.DeleteAsync(id);
                _logger.LogInformation($"✅ Thread {id} deleted successfully");
                return Ok(new { message = "Thread deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Delete failed: {ex.Message}");
                return StatusCode(500, new { message = "Delete failed", error = ex.Message });
            }
        }

        private Guid? ValidateTokenAndGetUserId(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);
            
            try
            {
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = _configuration["Jwt:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = _configuration["Jwt:Audience"],
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
                
                var principal = tokenHandler.ValidateToken(token, validationParameters, out _);
                var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                
                if (Guid.TryParse(userIdClaim, out var userId))
                    return userId;
            }
            catch
            {
                return null;
            }
            
            return null;
        }
        // Đặt trong Base Controller (hoặc trực tiếp trong ThreadController)
        protected Guid GetUserIdFromClaims()
        {
            // HttpContext.User.Claims là IPrincipal/IIdentity sau khi Token được xác thực
            
            // 1. Tìm Claim chứa User ID
            // Tên của Claim (Claim Type) thường là ClaimTypes.NameIdentifier (hoặc "sub")
            var userIdClaim = HttpContext.User.Claims.FirstOrDefault(c => 
                c.Type == System.Security.Claims.ClaimTypes.NameIdentifier || c.Type == "sub");

            if (userIdClaim == null)
            {
                // ❌ Không tìm thấy Claim ID trong Token
                return Guid.Empty;
            }

            // 2. Chuyển đổi giá trị Claim sang Guid
            if (Guid.TryParse(userIdClaim.Value, out Guid userId))
            {
                return userId;
            }

            // ❌ Giá trị Claim không phải là Guid hợp lệ
            return Guid.Empty;
        }
        public class LikeToggleDto
        {
            public bool IsLike { get; set; }
        }
    }
}
