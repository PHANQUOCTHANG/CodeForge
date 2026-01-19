using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using CodeForge.Core.Interfaces.Services;

namespace CodeForge.Core.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendOtpEmailAsync(string email, string otp)
        {
            var smtpSettings = _configuration.GetSection("EmailSettings");
            var smtpServer = smtpSettings["SmtpServer"];
            var smtpPort = int.Parse(smtpSettings["SmtpPort"] ?? "587");
            var senderEmail = smtpSettings["SenderEmail"];
            var senderPassword = smtpSettings["SenderPassword"];

            using (var client = new SmtpClient(smtpServer, smtpPort))
            {
                client.EnableSsl = true;
                client.Credentials = new NetworkCredential(senderEmail, senderPassword);

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(senderEmail, "CodeForge"),
                    Subject = "Mã xác minh OTP - CodeForge",
                    IsBodyHtml = true,
                    Body = GenerateOtpEmailBody(otp)
                };

                mailMessage.To.Add(email);

                try
                {
                    await client.SendMailAsync(mailMessage);
                }
                catch (Exception ex)
                {
                    throw new Exception($"Lỗi gửi email: {ex.Message}");
                }
            }
        }

        private string GenerateOtpEmailBody(string otp)
        {
            return $@"
                <html>
                    <head>
                        <style>
                            body {{ font-family: Arial, sans-serif; background-color: #f4f4f4; }}
                            .container {{ max-width: 600px; margin: 20px auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }}
                            .header {{ text-align: center; color: #333; margin-bottom: 20px; }}
                            .otp-code {{ font-size: 32px; font-weight: bold; color: #007bff; text-align: center; margin: 20px 0; letter-spacing: 5px; background-color: #f8f9fa; padding: 15px; border-radius: 5px; }}
                            .footer {{ text-align: center; color: #666; font-size: 12px; margin-top: 20px; }}
                        </style>
                    </head>
                    <body>
                        <div class='container'>
                            <h2 class='header'>Xác minh tài khoản CodeForge</h2>
                            <p>Xin chào,</p>
                            <p>Bạn vừa yêu cầu đặt lại mật khẩu hoặc xác minh tài khoản. Sử dụng mã OTP dưới đây để tiếp tục:</p>
                            <div class='otp-code'>{otp}</div>
                            <p><strong>Lưu ý:</strong> Mã OTP này sẽ hết hạn sau 10 phút.</p>
                            <p>Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.</p>
                            <div class='footer'>
                                <p>&copy; 2024 CodeForge. All rights reserved.</p>
                            </div>
                        </div>
                    </body>
                </html>
            ";
        }
    }
}
