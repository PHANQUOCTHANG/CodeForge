// Trong Entity QuizQuestion.cs (Đã sửa)

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace CodeForge.Core.Entities
{
    [Table("QuizQuestions")]
    public class QuizQuestion
    {
        [Key]
        public Guid QuestionId { get; set; } // Khóa chính (Đúng với tên cột lỗi QuizQuestionId?)

        // Khóa ngoại trỏ đến LessonQuiz, dùng tên LessonId để khớp với PK/FK của LessonQuiz
        // ✅ ĐỔI TÊN FK: Dùng tên rõ ràng hơn để tránh nhầm lẫn với Lesson.Id
        public Guid LessonQuizId { get; set; }

        [ForeignKey(nameof(LessonQuizId))]
        public LessonQuiz Quiz { get; set; } = null!;

        public string Question { get; set; } = string.Empty;
        public string Explanation { get; set; } = string.Empty;

        // ⚠ LƯU Ý: Đây là một Converter cần cấu hình trong DbContext (OnModelCreating)
        // Nếu không, nó sẽ gây lỗi vì SQL Server không có kiểu string array.
        public string[] Answers { get; set; } = Array.Empty<string>();

        // ✅ SỬA TÊN CỘT: Sử dụng [Column] để khớp với tên cột lỗi nếu bạn không muốn đổi tên thuộc tính
        [Column("CorrectIndex")]
        public int CorrectIndex { get; set; }

        // Loại bỏ QuizId nếu nó không tồn tại trong DB, EF đã tự suy luận quan hệ.
    }
}