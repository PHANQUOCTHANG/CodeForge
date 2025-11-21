
using CodeForge.Application.DTOs.Response;


namespace CodeForge.Core.Interfaces.Services
{
    /// <summary>
    /// Interface cho dịch vụ xử lý upload và xóa file media (ảnh, video...).
    /// </summary>
    public interface IPhotoService
    {
        /// <summary>
        /// Tải một file ảnh lên cloud.
        /// </summary>
        /// <param name="file">File ảnh nhận từ request (IFormFile).</param>
        /// <param name="folderName">Tên thư mục trên cloud để lưu ảnh (ví dụ: 'avatars', 'thumbnails').</param>
        /// <returns>DTO chứa thông tin ảnh đã upload.</returns>
        Task<PhotoUploadDto> UploadPhotoAsync(IFormFile file, string folderName);

        /// <summary>
        /// Xóa một file ảnh khỏi cloud dựa trên PublicId.
        /// </summary>
        /// <param name="publicId">ID công khai của ảnh.</param>
        /// <returns>True nếu xóa thành công, False nếu thất bại.</returns>
        Task<bool> DeletePhotoAsync(string publicId);
    }
}