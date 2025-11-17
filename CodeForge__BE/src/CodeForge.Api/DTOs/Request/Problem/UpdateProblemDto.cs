namespace CodeForge.Api.DTOs
{
    public class UpdateProblemDto
    {
        public Guid ProblemId { get; set; } = Guid.NewGuid();
        public Guid? LessonId { get; set; } // Chọn thuộc bài học nào (nếu có)
        public string Title { get; set; }  // Tên bài
        public string Description { get; set; }// Mô tả đề bài
        public string Difficulty { get; set; }
        public string? Tags { get; set; } // Tag: "array, hashmap"
        public string? FunctionName { get; set; } // Tên hàm: "twoSum"
        public string? Parameters { get; set; } // "int[] nums, int target"
        public string? ReturnType { get; set; } // "int[]"
        public string? Status { get; set; }

        public string? Constraints { get; set; } // "1 <= n <= 10^5"
        public int TimeLimit { get; set; }// (optional)
        public int MemoryLimit { get; set; } // (optional)
        public string? Notes { get; set; } // Ghi chú thêm (nếu có)
        public string? Slug { get; set; } = string.Empty;
    }
}