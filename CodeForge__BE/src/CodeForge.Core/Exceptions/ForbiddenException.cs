// Lỗi 403 Forbidden (Bị cấm - thường là vấn đề phân quyền)
namespace CodeForge.Core.Exceptions
{
    public class ForbiddenException : Exception
    {
        public ForbiddenException(string message) : base(message) { }
    }
}