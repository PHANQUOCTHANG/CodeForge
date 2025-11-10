using Microsoft.EntityFrameworkCore;
using CodeForge.Core.Entities;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.Text.Json;

namespace CodeForge.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        // =============================
        // 🔹 DbSet - Khai báo các bảng
        // =============================
        public DbSet<User> Users { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<CourseCategory> CourseCategory { get; set; }
        public DbSet<CourseReview> CourseReviews { get; set; }
        public DbSet<Module> Modules { get; set; }
        public DbSet<Lesson> Lessons { get; set; }
        public DbSet<Progress> Progress { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<LessonVideo> LessonVideos { get; set; }
        public DbSet<LessonQuiz> LessonQuizzes { get; set; }
        public DbSet<QuizQuestion> QuizQuestions { get; set; }
        public DbSet<LessonText> LessonTexts { get; set; }
        public DbSet<Problem> CodingProblems { get; set; }
        public DbSet<TestCase> TestCases { get; set; }
        public DbSet<Submission> Submissions { get; set; }

        // =============================
        // 🔹 Cấu hình mối quan hệ và converter
        // =============================
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 1️⃣ Lesson <-> LessonVideo
            modelBuilder.Entity<Lesson>()
                .HasOne(lesson => lesson.LessonVideo)
                .WithOne(video => video.Lesson)
                .HasForeignKey<LessonVideo>(video => video.LessonId);

            // 2️⃣ Lesson <-> LessonText
            modelBuilder.Entity<Lesson>()
                .HasOne(lesson => lesson.LessonText)
                .WithOne(text => text.Lesson)
                .HasForeignKey<LessonText>(text => text.LessonId);

            // 3️⃣ Lesson <-> LessonQuiz
            modelBuilder.Entity<Lesson>()
                .HasOne(lesson => lesson.LessonQuiz)
                .WithOne(quiz => quiz.Lesson)
                .HasForeignKey<LessonQuiz>(quiz => quiz.LessonId);


            // 4️⃣ Lesson <-> CodingProblem
            modelBuilder.Entity<Lesson>()
                .HasOne(lesson => lesson.CodingProblem)
                .WithOne(problem => problem.Lesson)
                .HasForeignKey<Problem>(problem => problem.LessonId);
            // 2️⃣ Cấu hình Quan hệ Lesson <-> LessonQuiz <-> QuizQuestion
            modelBuilder.Entity<LessonQuiz>()
                .HasMany(lq => lq.Questions) // LessonQuiz có nhiều QuizQuestion
                .WithOne(q => q.Quiz)
                .HasForeignKey(q => q.LessonQuizId) // FK trong QuizQuestion là LessonQuizId
                .OnDelete(DeleteBehavior.Cascade); // Riêng QuizQuestion cần Cascade Delete khi Quiz bị xóa


            // 3️⃣ Cấu hình Value Converter cho QuizQuestion.Answers
            var stringArrayConverter = new ValueConverter<string[], string>(
                // ✅ Sửa lỗi cú pháp JsonSerializer
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                v => JsonSerializer.Deserialize<string[]>(v, (JsonSerializerOptions?)null) ?? Array.Empty<string>()
            );

            modelBuilder.Entity<QuizQuestion>()
                .Property(q => q.Answers)
                .HasConversion(stringArrayConverter)
                .HasColumnType("NVARCHAR(MAX)") // Luôn xác định kiểu cho NVARCHAR(MAX)
                .HasDefaultValueSql("N'[]'");


            // 4️⃣ Bảo vệ RefreshToken bằng Concurrency Token (Tùy chọn, nên có)
            modelBuilder.Entity<RefreshToken>()
                .Property(r => r.TokenHash)
                .IsRequired()
                .HasMaxLength(450); // Đảm bảo độ dài cho TokenHash


        }
    }
}
