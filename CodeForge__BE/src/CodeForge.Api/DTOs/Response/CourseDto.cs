

using CodeForge.Core.Entities;

namespace CodeForge.Api.DTOs.Response
{
    public class CourseDto
    {

        public Guid CourseId { get; set; }

        public string Title { get; set; }

        public string? Description { get; set; }


        public string Level { get; set; }


        public string Language { get; set; }


        public Guid CreatedBy { get; set; } 


        public User User { get; set; }

        public DateTime CreatedAt { get; set; }
        public string Status { get; set; } 

        public bool IsDeleted { get; set; } 

    }
}