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
                case UnauthorizedException unauthorizedEx:
                    statusCode = StatusCodes.Status401Unauthorized;
                    message = unauthorizedEx.Message;
                    break;
                case ConflictException conflictEx:
                    statusCode = StatusCodes.Status409Conflict;
                    message = conflictEx.Message;
                    break;
                // Có thể thêm NotFoundException, BadRequestException, v.v.
                case BadRequestException badRequestEx:
                    statusCode = StatusCodes.Status400BadRequest;
                    message = badRequestEx.Message;
                    break;

                case NotFoundException notFoundEx:
                    statusCode = StatusCodes.Status404NotFound;
                    message = notFoundEx.Message;
                    break;

                case ForbiddenException forbiddenEx:
                    statusCode = StatusCodes.Status403Forbidden;
                    message = forbiddenEx.Message;
                    break;
                default:
                    // Ghi log lỗi 500 chi tiết
                    _logger.LogError(exception, "Lỗi server không mong muốn xảy ra.");
                    break;
            }

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = statusCode;

            // Sử dụng lớp ApiResponse<T> để đảm bảo định dạng nhất quán
            var responseBody = ApiResponse<string>.Fail(message);

            await context.Response.WriteAsJsonAsync(responseBody);
        }
    }
}