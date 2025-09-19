using Microsoft.EntityFrameworkCore;
using CodeForge.Infrastructure;
using CodeForge.Infrastructure.Data;
using CodeForge.Core.Mappings;
using AutoMapper;

namespace CodeForge
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();


            // Đăng ký DbContext
            builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));



            builder.Services.AddAutoMapper(typeof(MappingProfile));


            // Register DI
            builder.Services.AddInfrastructure();

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }
    }
}
