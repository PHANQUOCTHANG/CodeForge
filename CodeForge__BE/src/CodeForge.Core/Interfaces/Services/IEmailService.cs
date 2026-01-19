using System.Threading.Tasks;

namespace CodeForge.Core.Interfaces.Services
{
    public interface IEmailService
    {
        Task SendOtpEmailAsync(string email, string otp);
    }
}
