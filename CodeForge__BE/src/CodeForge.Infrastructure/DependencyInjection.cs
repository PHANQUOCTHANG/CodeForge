
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Infrastructure.Repositories;
using CodeForge.Core.Interfaces.Services;
using CodeForge__BE.src.CodeForge.Core.Interfaces.Repositories;
using CodeForge__BE.src.CodeForge.Infrastructure.Repositories;
using CodeForge__BE.src.CodeForge.Core.Interfaces.Services;
using CodeForge__BE.src.CodeForge.Core.Services;
using CodeForge.Core.Service;

namespace CodeForge.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services)
        {
            // user.
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IUserService, UserService>();
            //course.
            services.AddScoped<ICourseRepository, CourseRepository>();
            services.AddScoped<ICourseService, CourseService>();
            //auth.
            services.AddScoped<IAuthRepository, AuthRepository>();
            services.AddScoped<IAuthService, AuthService>();
            return services;
        }
    }
}
