
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Infrastructure.Repositories;
using CodeForge.Core.Interfaces.Services;
using CodeForge.Core.Service;

namespace CodeForge.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services)
        {
            // user.
            services.AddScoped<IUserRepository , UserRepository>();
            services.AddScoped<IUserService , UserService>();

            //auth.
            services.AddScoped<IAuthRepository, AuthRepository>();
            services.AddScoped<IAuthService, AuthService>();

            // problem .
            services.AddScoped<IProblemRepository, ProblemRepository>();
            services.AddScoped<IProblemService, ProblemService>();
            return services;
        }
    }
}
