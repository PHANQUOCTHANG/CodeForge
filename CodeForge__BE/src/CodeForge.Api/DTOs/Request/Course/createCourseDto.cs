using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CodeForge.Api.DTOs.Request.Course
{
    public class CreateCourseDto
    {

        public string Title { get; set; }

        public string? Description { get; set; }
        public string Status { get; set; }

        public string Level { get; set; }

        public string Language { get; set; }

        public Guid CreatedBy { get; set; }
    }
}