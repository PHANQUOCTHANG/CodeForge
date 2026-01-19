namespace CodeForge.Api.DTOs.Auth
{
    public class VerifyOtpResponseDto
    {
        public bool Success { get; set; }
        public string ResetToken { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}
