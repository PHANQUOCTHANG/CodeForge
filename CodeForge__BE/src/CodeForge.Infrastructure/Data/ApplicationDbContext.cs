using Microsoft.EntityFrameworkCore;
using CodeForge.Core.Entities;

namespace CodeForge.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<Problem> CodingProblems { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<CourseCategory> CourseCategory { get; set; }
        public DbSet<CourseReview> CourseReviews { get; set; }

        public DbSet<Module> Modules { get; set; }

        public DbSet<Lesson> Lessons { get; set; }

        public DbSet<TestCase> TestCases { get; set; }


    }
}
