// Lỗi 404 Not Found (Không tìm thấy tài nguyên)
namespace CodeForge.Core.Exceptions
{
    public class NotFoundException : Exception
    {
        public NotFoundException(string message) : base(message) { }
    }
}