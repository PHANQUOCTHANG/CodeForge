using System;

namespace CodeForge.Api.DTOs.Response
{
    /// <summary>
    /// Data Transfer Object (DTO) chứa thông tin trả về
    /// sau khi tải một file ảnh lên cloud thành công.
    /// </summary>
    public class PhotoUploadDto
    {
        /// <summary>
        /// ID công khai (public_id) của ảnh trên dịch vụ cloud.
        /// Dùng để truy cập, quản lý hoặc xóa file sau này.
        /// </summary>
        public string PublicId { get; set; } = string.Empty;

        /// <summary>
        /// URL đầy đủ, an toàn (https) của ảnh đã được tải lên.
        /// Đây là URL chính để hiển thị ảnh trên frontend.
        /// </summary>
        public string SecureUrl { get; set; } = string.Empty;

        /// <summary>
        /// URL không an toàn (http) của ảnh.
        /// </summary>
        public string Url { get; set; } = string.Empty;

        /// <summary>
        /// Ngày tạo file trên cloud.
        /// </summary>
        public DateTime CreatedAt { get; set; }
    }
}