using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodeForge.Core.Entities
{
        [Table("Courses")]
        public class Course
        {
                [Key]
                public Guid CourseId { get; set; } = Guid.NewGuid(); // CourseID UNIQUEIDENTIFIER DEFAULT NEWID()

                [Required, MaxLength(200)]
                public string Title { get; set; } = string.Empty;

                public string? Description { get; set; }
                public string? Overview { get; set; } // ✅ phần dài
                [Required]
                [MaxLength(20)]
                public string Level { get; set; } = "Beginner"; // beginner, intermediate, advanced

                [Required, MaxLength(50)]
                public string Language { get; set; } = string.Empty;

                // --- User relationship ---
                [Required]
                public Guid CreatedBy { get; set; }   // FK -> Users(UserID)

                [ForeignKey(nameof(CreatedBy))]
                public User User { get; set; } = null!;   // navigation property

                // --- Course category relationship ---
                [Required]
                public Guid CategoryId { get; set; } // FK -> CourseCategories(CategoryID)

                [ForeignKey(nameof(CategoryId))]
                public CourseCategory Category { get; set; } = null!;

                // --- Metadata ---
                public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

                [Required]
                [MaxLength(20)]
                public string Status { get; set; } = "active"; // default active

                public bool IsDeleted { get; set; } = false;

                // --- Additional fields ---
                [MaxLength(255)]
                public string? Thumbnail { get; set; } = null;  // Ảnh đại diện
                [Required, MaxLength(200)]
                public string Slug { get; set; } = string.Empty;  // ✅ thêm Slug

                [Column(TypeName = "decimal(18,2)")]
                public decimal Price { get; set; } = 0;         // 0 = miễn phí

                [Column(TypeName = "decimal(5,2)")]
                public decimal Discount { get; set; } = 0;      // % giảm giá

                public int Duration { get; set; } = 0;          // thời lượng (phút)

                public double Rating { get; set; } = 0;         // trung bình đánh giá
                public int TotalRatings { get; set; } = 0;      // tổng lượt đánh giá
                public int TotalStudents { get; set; } = 0;     // tổng số học viên
                public int LessonCount { get; set; } = 0;     // tổng số học viên


                public ICollection<Module> Modules { get; set; } = new List<Module>();
                public ICollection<CourseReview> Reviews { get; set; } = new List<CourseReview>();
                public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
                // --- Constructors ---
                public Course() { }
        }
}
