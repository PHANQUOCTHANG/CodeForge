using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CodeForge__BE.src.CodeForge.Api.DTOs.Request.Course
{
    public class createCourseDto
    {

        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }
        public string Status { get; set; } = "draft"; // mặc định "draft"

        public string Level { get; set; } = "Beginner"; // Beginner, Intermediate, Advanced

        public string Language { get; set; } = string.Empty;

        public Guid CreatedBy { get; set; } // id của user tạo
    }
}