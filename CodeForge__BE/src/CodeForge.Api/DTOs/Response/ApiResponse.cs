using System.Net;

// 1. Tối ưu hóa: Sử dụng Record để làm cho DTO bất biến (Immutable)
namespace CodeForge.Api.DTOs
{
    // Bỏ trường Code dư thừa (Code HTTP sẽ được đặt trong header)
    public record ApiResponse<T>
    {
        public bool IsSuccess { get; }
        public string Message { get; init; } = string.Empty;
        public T? Data { get; }
        public List<string>? Errors { get; } // Thêm trường Errors cho chi tiết lỗi

        // Constructor riêng cho nội bộ
        private ApiResponse(bool isSuccess, string message, T? data, List<string>? errors = null)
        {
            IsSuccess = isSuccess;
            Message = message;
            Data = data;
            Errors = errors;
        }

        // --- Factory Methods ---

        // 2. SUCCESS (GET/PUT/DELETE)
        public static ApiResponse<T> Success(T data, string message = "Thành công")
            => new(true, message, data);

        // 3. CREATED (POST - Dùng cho Register, tạo mới tài nguyên)
        // Lưu ý: Controller phải trả về Created (201)
        public static ApiResponse<T> Created(T data, string message = "Tạo mới thành công")
            => new(true, message, data);


        // 4. FAIL - Với một chuỗi lỗi đơn lẻ (Dùng cho lỗi nghiệp vụ chung)
        public static ApiResponse<T> Fail(string message)
            => new(false, message, default, null);

        // 5. FAIL - Với danh sách lỗi (Dùng cho lỗi xác thực Validation Errors - 400 Bad Request)
        public static ApiResponse<T> Fail(List<string> errors, string message = "Yêu cầu không hợp lệ")
            => new(false, message, default, errors);
    }
}