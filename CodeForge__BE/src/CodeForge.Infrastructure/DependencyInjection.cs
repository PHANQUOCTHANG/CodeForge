
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Infrastructure.Repositories;
using CodeForge.Core.Interfaces.Services;
using CodeForge__BE.src.CodeForge.Core.Interfaces.Services;
using CodeForge__BE.src.CodeForge.Core.Services;
using CodeForge.Core.Service;
using CodeForge.Core.Services;
using CodeForge.Infrastructure.Services;

namespace CodeForge.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services)
        {
            // user.
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IUserService, UserService>();
            //refresh toke
            services.AddScoped<ITokenService, TokenService>();

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
            // enrollment .
            services.AddScoped<IEnrollmentRepository, EnrollmentRepository>();
            services.AddScoped<IEnrollmentService, EnrollmentService>();
            //payment
            services.AddScoped<IPaymentRepository, PaymentRepository>();
            services.AddScoped<IPaymentService, PaymentService>();
            // vnpay .
            services.AddScoped<IVNPayService, VNPayService>();
            // progress .
            services.AddScoped<IProgressRepository, ProgressRepository>();
            services.AddScoped<IProgressService, ProgressService>();
            // testcase .
            services.AddScoped<ITestCaseRepository, TestCaseRepository>();
            services.AddScoped<ITestCaseService, TestCaseService>();

            // judge0 .
            services.AddHttpClient<IJudge0Service, Judge0Service>();
            return services;
        }
    }
}
