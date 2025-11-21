using System.ComponentModel.DataAnnotations;

namespace CodeForge.Api.DTOs.Request.Enrollment
{
    // DTO để nhận dữ liệu từ Frontend khi tạo đánh giá
    public class CreateReviewDto
    {
        // Khóa học được đánh giá (sẽ được lấy từ URL route /{courseId})
        public Guid CourseId { get; set; }

        // Giá trị đánh giá từ 1 đến 5 (bắt buộc)
        [Range(1, 5)]
        public int Rating { get; set; }

        // Nội dung bình luận (có thể để trống)
        [MaxLength(500)]
        public string? Comment { get; set; }

        // Thuộc tính này sẽ được Service tự điền từ Token
        [System.Text.Json.Serialization.JsonIgnore]
        public Guid UserId { get; set; }
    }
}