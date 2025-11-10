using Microsoft.EntityFrameworkCore;
using CodeForge.Infrastructure;
using CodeForge.Infrastructure.Data;
using CodeForge.Core.Mappings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using CodeForge.Api.Middleware;
using System.Text.Json.Serialization;
using CodeForge.Core.Settings;

namespace CodeForge
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services
            builder.Services.AddControllers()
            // 👇 Dòng này giúp tránh vòng lặp khi serialize entity có quan hệ
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                    options.JsonSerializerOptions.WriteIndented = true; // (tùy chọn: in JSON đẹp)
                });
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            // Cấu hình vnpay Settings từ appsettings.json

            builder.Services.Configure<VNPaySettings>(builder.Configuration.GetSection("VNPaySettings"));
            builder.Services.AddHttpContextAccessor();
            // Đăng ký DbContext
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

            // AutoMapper
            builder.Services.AddAutoMapper(typeof(MappingProfile));


            // Register DI
            builder.Services.AddInfrastructure();

            // JWT Authentication
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "default_secret_key"))
                };
            });

            builder.Services.AddAuthorization();

            // ✅ Cấu hình CORS linh hoạt
            var frontendUrl = builder.Configuration["FrontendUrl"] ?? "http://localhost:3000";
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy.WithOrigins(frontendUrl)
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials(); // <- Quan trọng nếu bạn dùng cookie/token trong header
                });
            });

            var app = builder.Build();
            // ĐĂNG KÝ MIDDLEWARE XỬ LÝ LỖI TOÀN CỤC Ở ĐÂY!
            // Vị trí này đảm bảo nó có thể bắt ngoại lệ từ hầu hết các phần sau đó của pipeline.
            app.UseMiddleware<ExceptionHandlingMiddleware>();
            // ✅ Thứ tự middleware đúng
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseCors("AllowFrontend"); // ⚡️ PHẢI đặt trước Authentication

            // 1. Kích hoạt Authentication: Đọc và xác minh token JWT
            app.UseAuthentication();

            // 2. Kích hoạt Authorization: Áp dụng các quy tắc bảo vệ
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
