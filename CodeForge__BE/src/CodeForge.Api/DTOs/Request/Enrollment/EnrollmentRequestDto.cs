
using System.ComponentModel.DataAnnotations;


namespace CodeForge.Api.DTOs.Request.Enrollment
{
    public class EnrollmentRequestDto
    {
        [Required]
        public Guid CourseId { get; set; }
    }
}