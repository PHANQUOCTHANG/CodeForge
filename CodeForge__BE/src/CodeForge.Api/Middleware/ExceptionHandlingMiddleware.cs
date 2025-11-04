using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using System;
using System.Threading.Tasks;
using CodeForge.Api.DTOs; // Giả sử ApiResponse<T> nằm trong DTOs
using CodeForge.Core.Exceptions; // Nơi đặt các Custom Exceptions

namespace CodeForge.Api.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(httpContext, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            // Thiết lập mặc định cho lỗi 500
            int statusCode = StatusCodes.Status500InternalServerError;
            string message = "Lỗi máy chủ không xác định. Vui lòng thử lại sau.";

            switch (exception)
            {
                // 1. Ưu tiên bắt các lỗi CON (lỗi cụ thể) TRƯỚC
                case UnauthorizedException unauthorizedEx:
                    statusCode = StatusCodes.Status401Unauthorized;
                    message = unauthorizedEx.Message;
                    _logger.LogWarning(exception, "Lỗi 401 Unauthorized: {Message}", message);
                    break;

                case ForbiddenException forbiddenEx:
                    statusCode = StatusCodes.Status403Forbidden;
                    message = forbiddenEx.Message;
                    _logger.LogWarning(exception, "Lỗi 403 Forbidden: {Message}", message);
                    break;

                case NotFoundException notFoundEx:
                    statusCode = StatusCodes.Status404NotFound;
                    message = notFoundEx.Message;
                    _logger.LogWarning(exception, "Lỗi 404 Not Found: {Message}", message);
                    break;

                case ConflictException conflictEx:
                    statusCode = StatusCodes.Status409Conflict;
                    message = conflictEx.Message;
                    _logger.LogWarning(exception, "Lỗi 409 Conflict: {Message}", message);
                    break;

                case BadRequestException badRequestEx:
                    statusCode = StatusCodes.Status400BadRequest;
                    message = badRequestEx.Message;
                    _logger.LogWarning(exception, "Lỗi 400 Bad Request: {Message}", message);
                    break;

                // 2. ✅ Bắt lớp CHA (ApplicationException) SAU CÙNG
                // Bất kỳ lỗi nghiệp vụ nào kế thừa từ ApplicationException
                // mà không được định nghĩa ở trên sẽ bị bắt tại đây.
                case Core.Exceptions.ApplicationException appEx:
                    // Lấy StatusCode động từ chính exception
                    statusCode = (int)appEx.StatusCode;
                    message = appEx.Message;
                    _logger.LogWarning(exception, "Lỗi nghiệp vụ (ApplicationException) {StatusCode}: {Message}", statusCode, message);
                    break;

                // 3. Lỗi 500 (Default)
                default:
                    _logger.LogError(exception, "Lỗi 500 Server không mong muốn: {Message}", exception.Message);
                    break;
            }

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = statusCode;

            var responseBody = ApiResponse<string>.Fail(message);
            await context.Response.WriteAsJsonAsync(responseBody);
        }
    }
}