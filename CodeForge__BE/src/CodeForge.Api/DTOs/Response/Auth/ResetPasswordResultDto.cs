namespace CodeForge.src.CodeForge.Api.DTOs.Response.Auth
{
    public class ResetPasswordResultDto
    {
        public readonly bool Success;
        public readonly string Message;

        public ResetPasswordResultDto(bool Success, string Message)
        {
            this.Success = Success;
            this.Message = Message;
        }
    }
}
