using Microsoft.EntityFrameworkCore;
using CodeForge.Core.Entities;

namespace CodeForge.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Problem> CodingProblems { get; set; }
        public DbSet<Course> Courses { get; set; }

        public DbSet<Module> Modules { get; set; }

        public DbSet<Lesson> Lessons { get; set; }

    }
}
