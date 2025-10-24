// Lỗi 400 Bad Request (Yêu cầu không hợp lệ)
namespace CodeForge.Core.Exceptions
{
    public class BadRequestException : Exception
    {
        public BadRequestException(string message) : base(message) { }
    }
}