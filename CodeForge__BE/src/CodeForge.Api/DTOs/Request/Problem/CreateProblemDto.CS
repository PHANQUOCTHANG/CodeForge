namespace CodeForge.Api.DTOs
{
    public class CreateProblemDto
    {
        public Guid? LessonId { get; set; } // Chọn thuộc bài học nào (nếu có)
        public string Title { get; set; } 
        public string? Slug { get; set; } 
        public string? Description { get; set; }  // Mô tả đề bài
        public string Difficulty { get; set; } = "Easy"; // Độ khó
        public string? Tags { get; set; } // Tag: "array, hashmap"
        public string? FunctionName { get; set; } // Tên hàm: "twoSum"
        public string? Parameters { get; set; } // "int[] nums, int target"
        public string? ReturnType { get; set; } // "int[]"
        public string? Status { get; set; } = "NOT_STARTED";

        public string? Constraints { get; set; } // "1 <= n <= 10^5"
        public int TimeLimit { get; set; } = 1000; // (optional)
        public int MemoryLimit { get; set; } = 256; // (optional)
        public string? Notes { get; set; } // Ghi chú thêm (nếu có)
    }
}