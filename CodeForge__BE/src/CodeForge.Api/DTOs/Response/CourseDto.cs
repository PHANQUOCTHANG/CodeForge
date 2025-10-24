namespace CodeForge.Api.DTOs.Response
{
        public class CourseDto
        {
                public Guid CourseId { get; set; }
                public string Title { get; set; } = string.Empty;
                public string Slug { get; set; } = string.Empty;
                public string? Description { get; set; }

                public string? Overview { get; set; } // ✅ phần dài
                public string Level { get; set; } = string.Empty;
                public string Language { get; set; } = string.Empty;
                public decimal Price { get; set; }
                public decimal Discount { get; set; }
                public double Rating { get; set; }
                public int TotalStudents { get; set; }
                public int Duration { get; set; } = 0;
                public string Status { get; set; } = "active";
                public string? Thumbnail { get; set; }
                public DateTime CreatedAt { get; set; }
                public int LessonCount { get; set; } = 0;     // tổng số học viên
                                                              // thông tin liên quan
                public string CategoryName { get; set; } = string.Empty;
                public string Author { get; set; } = string.Empty;
        }
}
