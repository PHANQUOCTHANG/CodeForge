using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using CodeForge.Api.DTOs.Response;
using CodeForge.Core.Interfaces.Services;
using CodeForge.Core.Settings;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Threading.Tasks;

namespace CodeForge.Infrastructure.Services
{
    /// <summary>
    /// Implement dịch vụ IPhotoService sử dụng Cloudinary.
    /// </summary>
    public class CloudinaryService : IPhotoService
    {
        private readonly Cloudinary _cloudinary;
        private readonly ILogger<CloudinaryService> _logger;

        public CloudinaryService(IOptions<CloudinarySettings> config, ILogger<CloudinaryService> logger)
        {
            _logger = logger;
            if (config.Value == null || string.IsNullOrEmpty(config.Value.CloudName))
            {
                _logger.LogError("CloudinarySettings không được cấu hình trong appsettings.json.");
                throw new ArgumentNullException(nameof(config), "CloudinarySettings không được rỗng.");
            }

            // 1. Tạo Account từ Settings
            var account = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );

            // 2. Khởi tạo client Cloudinary
            _cloudinary = new Cloudinary(account);
            // Ping is not available in this SDK version; skip explicit ping and rely on API calls to surface credentials issues.
            _logger.LogInformation("Cloudinary service initialized.");
        }

        /// <summary>
        /// Thực thi việc tải ảnh lên Cloudinary.
        /// </summary>
        public async Task<PhotoUploadDto> UploadPhotoAsync(IFormFile file, string folderName)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("File không được rỗng.", nameof(file));
            }

            // 3. Mở stream của file
            await using var stream = file.OpenReadStream();

            // 4. Chuẩn bị các tham số upload
            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(file.FileName, stream),
                Folder = folderName, // Tên thư mục trên Cloudinary
                // Tự động tối ưu hóa (chọn định dạng, chất lượng)
                Transformation = new Transformation().Quality("auto").FetchFormat("auto"),
                Overwrite = true // Ghi đè nếu file trùng tên
            };

            // 5. Gọi API Upload
            _logger.LogInformation("Uploading image {FileName} to Cloudinary folder {Folder}...", file.FileName, folderName);
            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            // 6. Xử lý kết quả
            if (uploadResult.Error != null)
            {
                _logger.LogError("Cloudinary upload failed: {Error}", uploadResult.Error.Message);
                throw new Exception($"Lỗi tải ảnh lên Cloudinary: {uploadResult.Error.Message}");
            }

            _logger.LogInformation("Image {FileName} uploaded successfully. PublicId: {PublicId}", file.FileName, uploadResult.PublicId);

            // 7. Trả về DTO
            return new PhotoUploadDto
            {
                PublicId = uploadResult.PublicId,
                Url = uploadResult.Url.ToString(),
                SecureUrl = uploadResult.SecureUrl.ToString(),
                CreatedAt = uploadResult.CreatedAt
            };
        }

        /// <summary>
        /// Thực thi việc xóa ảnh khỏi Cloudinary.
        /// </summary>
        public async Task<bool> DeletePhotoAsync(string publicId)
        {
            if (string.IsNullOrEmpty(publicId))
            {
                throw new ArgumentException("PublicId không được rỗng.", nameof(publicId));
            }

            var deleteParams = new DeletionParams(publicId)
            {
                ResourceType = ResourceType.Image // Chỉ định loại tài nguyên
            };

            _logger.LogInformation("Deleting image {PublicId} from Cloudinary...", publicId);
            var deletionResult = await _cloudinary.DestroyAsync(deleteParams);

            // Kết quả "ok" nghĩa là xóa thành công
            if (deletionResult.Result.Equals("ok", StringComparison.OrdinalIgnoreCase))
            {
                _logger.LogInformation("Image {PublicId} deleted successfully.", publicId);
                return true;
            }

            // Xóa không thành công (ví dụ: "not found")
            _logger.LogError("Cloudinary delete failed for {PublicId}. Result: {Result}", publicId, deletionResult.Result);
            // Vẫn trả về true nếu file không tìm thấy, vì mục đích là file không còn tồn tại
            if (deletionResult.Result.Equals("not found", StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }

            return false;
        }
    }
}