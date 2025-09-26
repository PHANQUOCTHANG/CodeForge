using Microsoft.Extensions.DependencyInjection;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Infrastructure.Repositories;
using CodeForge.Core.Interfaces.Services;
using CodeForge__BE.src.CodeForge.Core.Interfaces.Repositories;
using CodeForge__BE.src.CodeForge.Infrastructure.Repositories;
using CodeForge__BE.src.CodeForge.Core.Interfaces.Services;
using CodeForge__BE.src.CodeForge.Core.Services;

namespace CodeForge.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services)
        {
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IUserService, UserService>();
            //Course
            services.AddScoped<ICourseRepository, CourseRepository>();
            services.AddScoped<ICourseService, CourseService>();
            return services;
        }
    }
}
