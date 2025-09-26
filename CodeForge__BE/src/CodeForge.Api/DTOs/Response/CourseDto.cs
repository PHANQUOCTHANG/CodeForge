using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CodeForge.Core.Entities;

namespace CodeForge__BE.src.CodeForge.Api.DTOs.Response
{
    public class CourseDto
    {

        public Guid CourseId { get; set; } = Guid.NewGuid();  // tương ứng CourseID UNIQUEIDENTIFIER DEFAULT NEWID()


        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }


        public string Level { get; set; } = "Beginner"; // "Beginner","Intermediate","Advanced"


        public string Language { get; set; } = string.Empty;


        public Guid CreatedBy { get; set; }   // FK -> Users.UserID


        public User User { get; set; } = null!;   // navigation property

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "draft"; // mặc định "draft"

        public bool IsDeleted { get; set; } = false;

    }
}