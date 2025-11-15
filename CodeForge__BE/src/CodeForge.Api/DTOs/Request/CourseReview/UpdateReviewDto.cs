using System.ComponentModel.DataAnnotations;

namespace CodeForge.Api.DTOs.Request.Enrollment
{
    // DTO để nhận dữ liệu khi cập nhật đánh giá hiện có
    public class UpdateReviewDto
    {
        // ID của đánh giá cần cập nhật (lấy từ route /{reviewId})
        public Guid ReviewId { get; set; }

        [Range(1, 5)]
        public int Rating { get; set; }

        [MaxLength(500)]
        public string? Comment { get; set; }
    }
}