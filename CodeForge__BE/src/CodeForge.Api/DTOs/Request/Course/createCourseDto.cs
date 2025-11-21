using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using CodeForge.Application.DTOs.Lessons;
using CodeForge.Application.DTOs.Modules;

namespace CodeForge.Api.DTOs.Request.Course
{
        // DTO chính, lồng nhau
        public class CreateCourseDto
        {
                [Required]
                [StringLength(200)]
                public string Title { get; set; } = string.Empty;
                public string? Slug { get; set; } // Nếu không gửi, backend sẽ tự tạo slug từ Title
                public string? Description { get; set; }
                public string? Overview { get; set; }

                [Required]
                public string Level { get; set; } = "beginner";

                [Required]
                public string Language { get; set; } = "C#";
                public Guid CreatedBy { get; set; } = Guid.Empty;
                [Required]
                public Guid CategoryID { get; set; } // Thay vì gửi cả object Category
                public string Status { get; set; } = "draft"; // draft | published
                public decimal Price { get; set; } = 0;
                public decimal Discount { get; set; } = 0;
                public string? Thumbnail { get; set; } // Sẽ nhận link online từ Cloudinary

                // Danh sách các Module
                public List<CreateModuleDto> Modules { get; set; } = new List<CreateModuleDto>();
        }

        // DTO cho Module

}