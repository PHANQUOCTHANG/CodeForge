using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;

namespace CodeForge.Api.Controllers
{
    // Lớp Controller "cha" giúp lấy UserId tiện lợi
    public abstract class BaseApiController : ControllerBase
    {
        /// <summary>
        /// Lấy UserId của người dùng đã xác thực từ token (JWT).
        /// </summary>
        /// <returns>Trả về Guid của UserId, hoặc null nếu không tìm thấy.</returns>
        protected Guid? GetUserId()
        {
            // Tìm claim (thông tin) có tên là "sub" (thường dùng) hoặc "nameidentifier"
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("sub");

            if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out Guid userId))
            {
                return userId;
            }

            // Trả về null nếu không tìm thấy claim hoặc không phải là Guid
            return null;
        }
    }
}