
using CodeForge.Api.DTOs.Statistics;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Core.Interfaces.Services;
using System.Threading.Tasks;

namespace CodeForge.Core.Services
{
    public class StatisticsService : IStatisticsService
    {
        private readonly IStatisticsRepository _statsRepository;

        public StatisticsService(IStatisticsRepository statsRepository)
        {
            _statsRepository = statsRepository;
        }

        public async Task<DashboardStatsDto> GetAdminDashboardStatsAsync()
        {
            // Có thể thêm logic caching ở đây nếu query quá nặng (Redis hoặc MemoryCache)
            return await _statsRepository.GetDashboardStatsAsync();
        }
    }
}