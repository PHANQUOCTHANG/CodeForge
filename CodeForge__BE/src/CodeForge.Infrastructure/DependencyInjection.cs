
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Infrastructure.Repositories;
using CodeForge.Core.Interfaces.Services;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Infrastructure.Repositories;
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

            // problem .
            services.AddScoped<IProblemRepository, ProblemRepository>();
            services.AddScoped<IProblemService, ProblemService>();

            // module .
            services.AddScoped<IModuleRepository, ModuleRepository>();
            services.AddScoped<IModuleService, ModuleService>();

            // lesson .
            services.AddScoped<ILessonRepository, LessonRepository>();
            services.AddScoped<ILessonService, LessonService>();

            // testcase .
            services.AddScoped<ITestCaseRepository,TestCaseRepository>();
            services.AddScoped<ITestCaseService, TestCaseService>();
            
            // judge0 .
            services.AddHttpClient<IJudge0Service, Judge0Service>();
            return services;
        }
    }
}
