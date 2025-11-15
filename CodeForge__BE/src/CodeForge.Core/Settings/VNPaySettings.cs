namespace CodeForge.Core.Settings
{
    /// <summary>
    /// Chứa các cấu hình cần thiết để kết nối và sử dụng VNPay API.
    /// </summary>
    public class VNPaySettings
    {
        /// <summary>
        /// Mã website của Merchant trên hệ thống của VNPay.
        /// </summary>
        public string TmnCode { get; set; } = string.Empty;

        /// <summary>
        /// Chuỗi bí mật dùng để tạo và xác thực chữ ký HmacSHA512.
        /// </summary>
        public string HashSecret { get; set; } = string.Empty;

        /// <summary>
        /// URL cổng thanh toán VNPay (Sandbox hoặc Production).
        /// </summary>
        public string BaseUrl { get; set; } = string.Empty;

        /// <summary>
        /// Phiên bản API VNPay đang sử dụng.
        /// </summary>
        public string Version { get; set; } = "2.1.0";

        /// <summary>
        /// Lệnh thực hiện thanh toán (thường là 'pay').
        /// </summary>
        public string Command { get; set; } = "pay";

        /// <summary>
        /// Mã tiền tệ (ví dụ: 'VND').
        /// </summary>
        public string CurrCode { get; set; } = "VND";

        /// <summary>
        /// Ngôn ngữ hiển thị trên cổng thanh toán ('vn' hoặc 'en').
        /// </summary>
        public string Locale { get; set; } = "vn";

        /// <summary>
        /// URL backend mà VNPay sẽ gửi Instant Payment Notification (IPN) đến.
        /// Phải là URL công khai.
        /// </summary>
        public string IpnUrl { get; set; } = string.Empty;

        /// <summary>
        /// URL frontend mà người dùng sẽ được chuyển hướng về sau khi thanh toán.
        /// </summary>
        public string ReturnUrl { get; set; } = string.Empty;
    }
}