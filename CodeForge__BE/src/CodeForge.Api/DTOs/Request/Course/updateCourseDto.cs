using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using CodeForge.Api.DTOs.Modules;


namespace CodeForge.Api.DTOs.Request.Course
{
    public class UpdateCourseDto
    {
        public Guid? CourseId { get; set; } // Nullable: Nếu null -> Tạo mới
        [Required]
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Overview { get; set; }
        public string Level { get; set; } = "beginner";
        public string Language { get; set; } = "C#";
        public Guid CategoryID { get; set; }
        public decimal Price { get; set; }
        public decimal Discount { get; set; }
        public string? Thumbnail { get; set; }
        public string Status { get; set; } = "active";

        // Danh sách Module cần cập nhật/thêm mới
        public List<UpdateModuleDto> Modules { get; set; } = new List<UpdateModuleDto>();
    }
}