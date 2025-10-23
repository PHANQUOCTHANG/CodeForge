using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CodeForge.Api.DTOs.Request.Course
{
    public class CreateCourseDto
    {
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }
        public string Level { get; set; } = "beginner"; // beginner, intermediate, advanced

        public string? Language { get; set; } = string.Empty;
        public Guid CreatedBy { get; set; }
    }
}