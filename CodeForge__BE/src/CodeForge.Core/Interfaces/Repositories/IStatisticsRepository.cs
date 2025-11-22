
using System.Threading.Tasks;
using CodeForge.Api.DTOs.Statistics;

namespace CodeForge.Core.Interfaces.Repositories
{
    public interface IStatisticsRepository
    {
        Task<DashboardStatsDto> GetDashboardStatsAsync();
    }
}