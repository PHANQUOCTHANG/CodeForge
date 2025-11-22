using CodeForge.Api.DTOs;
using CodeForge.Api.DTOs.Response; // Wrapper ApiResponse của bạn
using CodeForge.Core.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace CodeForge.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "admin")] // 🔒 Chỉ Admin mới được xem
    public class DashboardController : ControllerBase
    {
        private readonly IStatisticsService _statsService;

        public DashboardController(IStatisticsService statsService)
        {
            _statsService = statsService;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var result = await _statsService.GetAdminDashboardStatsAsync();
            return Ok(ApiResponse<object>.Success(result));
        }
    }
}