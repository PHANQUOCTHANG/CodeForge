using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;

// Thêm thư viện Custom Exceptions đã tạo trước đó
using CodeForge.Core.Exceptions;

namespace CodeForge.Api.Controllers
{
    // Lớp Controller "cha" giúp lấy UserId tiện lợi
    public abstract class BaseApiController : ControllerBase
    {
        // ✅ 1. Phiên bản an toàn: Trả về Guid? (Dùng cho các endpoint không bắt buộc đăng nhập)
        /// <summary>
        /// Lấy UserId của người dùng đã xác thực từ token (JWT).
        /// </summary>
        protected Guid? GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("sub");

            if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out Guid userId))
            {
                return userId;
            }

            return null;
        }

        // ------------------------------------------------------------------------

        // ✅ 2. Phiên bản bắt buộc: Trả về Guid và ném lỗi nếu null (Dùng cho các endpoint [Authorize])
        /// <summary>
        /// Lấy UserId non-nullable của người dùng. Dùng cho Actions có [Authorize].
        /// </summary>
        /// <exception cref="ForbiddenException">Ném lỗi nếu User đã đăng nhập nhưng không có UserId Claim.</exception>
        protected Guid GetRequiredUserId()
        {
            var userId = GetUserId(); // Gọi hàm an toàn

            if (userId == null)
            {
                // Nếu đến đây (và Controller có [Authorize]), nghĩa là token thiếu Claim cần thiết.
                // Điều này là lỗi phân quyền/xác thực không đầy đủ (Forbidden).
                throw new ForbiddenException("Authentication claims are missing or invalid for this action.");
            }

            return userId.Value;
        }
    }
}