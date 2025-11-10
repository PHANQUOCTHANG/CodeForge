

namespace CodeForge.Api.DTOs.Response
{
    /// <summary>
    /// DTO trả về thông tin của một lần đăng ký khóa học.
    /// Thường được sử dụng trong các API như "GetMyEnrollments".
    /// </summary>
    public class EnrollmentDto
    {
        /// <summary>
        /// ID của việc đăng ký (PK).
        /// Ánh xạ từ: EnrollmentID
        /// </summary>
        public Guid EnrollmentId { get; set; }

        /// <summary>
        /// ID của người dùng đã đăng ký.
        /// Ánh xạ từ: UserID
        /// </summary>
        public Guid UserId { get; set; }

        /// <summary>
        /// ID của khóa học được đăng ký.
        /// Ánh xạ từ: CourseID
        /// </summary>
        public Guid CourseId { get; set; }

        /// <summary>
        /// Ngày đăng ký.
        /// Ánh xạ từ: EnrolledAt
        /// </summary>
        public DateTime EnrolledAt { get; set; }

        /// <summary>
        /// Trạng thái đăng ký (ví dụ: "enrolled", "cancelled").
        /// Ánh xạ từ: Status
        /// </summary>
        public string Status { get; set; } = string.Empty;

        /// <summary>
        /// Thông tin tóm tắt của khóa học đã đăng ký.
        /// Dữ liệu này được nạp (Include) từ bảng Courses.
        /// </summary>
        public CourseDto? Course { get; set; }
    }
}