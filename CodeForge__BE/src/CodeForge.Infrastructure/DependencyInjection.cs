using Microsoft.Extensions.DependencyInjection;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Infrastructure.Repositories;
using CodeForge.Core.Interfaces.Services;

namespace CodeForge.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services)
        {
            services.AddScoped<IUserRepository , UserRepository>();
            services.AddScoped<IUserService , UserService>();
            return services;
        }
    }
}
