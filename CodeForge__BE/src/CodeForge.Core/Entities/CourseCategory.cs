using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodeForge.Core.Entities
{
    [Table("CourseCategories")]
    public class CourseCategory
    {
        [Key]
        public Guid CategoryId { get; set; } = Guid.NewGuid(); // CategoryID UNIQUEIDENTIFIER DEFAULT NEWID()

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty; // Tên danh mục, unique

        [MaxLength(255)]
        public string? Description { get; set; }

        [MaxLength(255)]
        public string? Icon { get; set; } // URL hoặc tên icon hiển thị

        public bool IsDeleted { get; set; } = false;

        // --- Navigation property ---
        public ICollection<Course> Courses { get; set; } = new List<Course>();

        // --- Constructors ---
        public CourseCategory() { }
    }
}
