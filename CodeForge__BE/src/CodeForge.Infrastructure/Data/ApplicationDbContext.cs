using Microsoft.EntityFrameworkCore;
using CodeForge.Core.Entities;

namespace CodeForge.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Course> courses { get; set; }

    }
}
