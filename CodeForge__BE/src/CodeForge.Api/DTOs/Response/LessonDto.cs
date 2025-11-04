using System.ComponentModel.DataAnnotations;
using CodeForge.Api.DTOs.Response;

namespace CodeForge.Application.DTOs.Response
{
        /// <summary>
        /// DTO trả về thông tin chi tiết của một bài học.
        /// </summary>
        public class LessonDto
        {
                public Guid LessonId { get; set; }
                public Guid ModuleId { get; set; }
                public string Title { get; set; } = string.Empty;

                /// <summary>
                /// Loại bài học: "video", "text", "quiz", "coding"
                /// </summary>
                public string LessonType { get; set; } = string.Empty;
                public bool IsCompleted { get; set; } = false; // Trạng thái hoàn thành
                public int OrderIndex { get; set; }
                public int Duration { get; set; } // Thời lượng (tính bằng giây hoặc phút)

                // Các nội dung chi tiết của bài học (chỉ một trong số này sẽ có dữ liệu)
                public LessonVideoDto? VideoContent { get; set; }
                public LessonTextDto? TextContent { get; set; }
                // ✅ SỬA: Đã cập nhật DTO Quiz để chứa Questions
                public LessonQuizDto? QuizContent { get; set; }
                public ProblemDto? CodingProblem { get; set; }
        }

        // ===================================
        // DTOs CON (Nội dung chi tiết)
        // ===================================

        public class LessonVideoDto
        {
                public string VideoUrl { get; set; } = string.Empty;
                public string? Caption { get; set; }
        }

        public class LessonTextDto
        {
                public string Content { get; set; } = string.Empty;
        }

        /// <summary>
        /// DTO Quiz: Chứa các câu hỏi
        /// </summary>
        public class LessonQuizDto
        {
                public string Title { get; set; } = string.Empty;
                public string? Description { get; set; }

                // ✅ THÊM: Danh sách các câu hỏi đi kèm
                public ICollection<QuizQuestionDto> Questions { get; set; } = new List<QuizQuestionDto>();
        }

        /// <summary>
        /// DTO cho từng câu hỏi trong Quiz
        /// </summary>
        public class QuizQuestionDto
        {
                public Guid QuestionId { get; set; }
                public string Question { get; set; } = string.Empty;

                // ✅ Sử dụng string[] để biểu diễn các lựa chọn trả lời
                public string[] Answers { get; set; } = Array.Empty<string>();
                public string Explanation { get; set; } = string.Empty;
                // ✅ Chỉ gửi CorrectIndex nếu DTO này chỉ dành cho Admin (hoặc mục đích chấm điểm)
                public int CorrectIndex { get; set; }
        }

        /// <summary>
        /// DTO cho Problem/Coding (Nếu bạn đã có Problem Entity)
        /// </summary>

}