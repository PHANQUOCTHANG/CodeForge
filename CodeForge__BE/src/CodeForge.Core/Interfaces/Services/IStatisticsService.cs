
using System.Threading.Tasks;
using CodeForge.Api.DTOs.Statistics;

namespace CodeForge.Core.Interfaces.Services
{
    public interface IStatisticsService
    {
        Task<DashboardStatsDto> GetAdminDashboardStatsAsync();
    }
}