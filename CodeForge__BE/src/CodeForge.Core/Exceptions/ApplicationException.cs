using System;
using System.Net;

namespace CodeForge.Core.Exceptions
{
    // Lớp cha cho tất cả các lỗi nghiệp vụ
    public abstract class ApplicationException : Exception
    {
        public HttpStatusCode StatusCode { get; }

        protected ApplicationException(string message, HttpStatusCode statusCode)
            : base(message)
        {
            StatusCode = statusCode;
        }
    }
}