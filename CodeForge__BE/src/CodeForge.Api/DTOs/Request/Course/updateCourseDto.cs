using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CodeForge.Api.DTOs.Request.Course
{
    public class UpdateCourseDto
    {
        public Guid CourseId { get; set; }
        public string Title { get; set; } 
        public string? Description { get; set; }
        public string Status { get; set; } 

        public string Level { get; set; }

        public string Language { get; set; } 
    }
}