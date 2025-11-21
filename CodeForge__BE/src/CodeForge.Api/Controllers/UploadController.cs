using CodeForge.Api.DTOs;

using CodeForge.Application.DTOs.Response;
using CodeForge.Core.Interfaces.Services; // Namespace IPhotoService
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.IO; // For Path
using System.Linq; // For Enumerable.Contains
using System.Threading.Tasks;

namespace CodeForge.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Yêu cầu người dùng phải đăng nhập để upload
    public class UploadController : ControllerBase
    {
        private readonly IPhotoService _photoService;
        private readonly ILogger<UploadController> _logger;

        // Giới hạn kích thước file (ví dụ: 5MB)
        private const long MaxFileSize = 5 * 1024 * 1024;

        // Các định dạng file ảnh cho phép
        private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".webp", ".gif" };

        public UploadController(IPhotoService photoService, ILogger<UploadController> logger)
        {
            _photoService = photoService;
            _logger = logger;
        }

        /// <summary>
        /// Endpoint để upload một file ảnh (ví dụ: ảnh đại diện, ảnh bìa khóa học).
        /// Frontend phải gửi request dạng 'multipart/form-data'.
        /// </summary>
        /// <param name="file">File ảnh được gửi với key là 'file'.</param>
        /// <param name="folder">Tên thư mục trên cloud (key là 'folder').</param>
        [HttpPost("image")]
        [ProducesResponseType(typeof(ApiResponse<PhotoUploadDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> UploadImage(IFormFile file, [FromForm] string folder = "default")
        {
            // 1. Kiểm tra file tồn tại
            if (file == null || file.Length == 0)
            {
                _logger.LogWarning("Upload attempt failed: No file provided.");
                return BadRequest(ApiResponse<string>.Fail("Không có file nào được tải lên."));
            }

            // 2. Kiểm tra kích thước file
            if (file.Length > MaxFileSize)
            {
                _logger.LogWarning("File upload failed: File {FileName} size {FileSize} exceeds limit {MaxFileSize}.", file.FileName, file.Length, MaxFileSize);
                return BadRequest(ApiResponse<string>.Fail($"Kích thước file vượt quá giới hạn cho phép ({MaxFileSize / 1024 / 1024}MB)."));
            }

            // 3. Kiểm tra định dạng file (đuôi file)
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (string.IsNullOrEmpty(extension) || !AllowedExtensions.Contains(extension))
            {
                _logger.LogWarning("File upload failed: Invalid file type {FileExtension} for file {FileName}.", extension, file.FileName);
                return BadRequest(ApiResponse<string>.Fail($"Định dạng file không hợp lệ. Chỉ chấp nhận: {string.Join(", ", AllowedExtensions)}"));
            }

            // (Tùy chọn nâng cao: Kiểm tra Magic Bytes của file để đảm bảo đúng là ảnh)

            try
            {
                // 4. Gọi Service để upload
                var result = await _photoService.UploadPhotoAsync(file, folder);

                // 5. Trả về kết quả thành công
                return Ok(ApiResponse<PhotoUploadDto>.Success(result, "Tải ảnh lên thành công."));
            }
            catch (ArgumentException ex) // Bắt lỗi validation từ service
            {
                _logger.LogWarning(ex, "Argument error during image upload.");
                return BadRequest(ApiResponse<string>.Fail(ex.Message));
            }
            catch (Exception ex) // Bắt các lỗi khác (ví dụ: lỗi từ Cloudinary)
            {
                _logger.LogError(ex, "Lỗi xảy ra trong quá trình upload ảnh: {ErrorMessage}", ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, ApiResponse<string>.Fail($"Lỗi server: {ex.Message}"));
            }
        }

        // TODO: Thêm endpoint Delete
        /*
        [HttpDelete("image")]
        [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DeleteImage([FromQuery] string publicId)
        {
             if (string.IsNullOrEmpty(publicId))
             {
                 return BadRequest(ApiResponse<string>.Fail("PublicId là bắt buộc."));
             }
             try
             {
                 var result = await _photoService.DeletePhotoAsync(publicId);
                 if (result)
                 {
                    return Ok(ApiResponse<bool>.Success(true, "Xóa ảnh thành công."));
                 }
                 return NotFound(ApiResponse<string>.Fail("Lỗi xóa ảnh hoặc không tìm thấy file."));
             }
             catch (Exception ex)
             {
                 _logger.LogError(ex, "Lỗi khi xóa ảnh {PublicId}.", publicId);
                 return StatusCode(StatusCodes.Status500InternalServerError, ApiResponse<string>.Fail($"Lỗi server: {ex.Message}"));
             }
        }
        */
    }
}