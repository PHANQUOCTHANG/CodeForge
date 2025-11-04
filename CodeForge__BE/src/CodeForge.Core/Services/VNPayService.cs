using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System;
using System.Globalization;
using CodeForge.Core.Settings;
using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Services;
using CodeForge.Infrastructure.Utils;
using Microsoft.Extensions.Logging; // Đảm bảo bạn đã import ILogger

namespace CodeForge.Infrastructure.Services
{
    /// <summary>
    /// Implement interface IVNPayService, sử dụng VnPayLibrary.
    /// </summary>
    public class VNPayService : IVNPayService
    {
        private readonly VNPaySettings _settings;
        private readonly VnPayLibrary _vnPayLibrary;
        private readonly ILogger<VNPayService> _logger;

        public VNPayService(IOptions<VNPaySettings> settingsOptions, ILogger<VNPayService> logger)
        {
            _settings = settingsOptions?.Value ?? throw new ArgumentNullException(nameof(settingsOptions));
            _vnPayLibrary = new VnPayLibrary();
            _logger = logger;

            // Log debug (giữ nguyên)
            _logger.LogWarning("--- [DEBUG] Đang kiểm tra VNPaySettings ---");
            _logger.LogWarning("TmnCode: {TmnCode}", _settings.TmnCode);
            _logger.LogWarning("HashSecret: [ĐÃ GIẤU]", string.IsNullOrEmpty(_settings.HashSecret) ? "RỖNG" : "CÓ GIÁ TRỊ");
            _logger.LogWarning("BaseUrl: {BaseUrl}", _settings.BaseUrl);
            _logger.LogWarning("ReturnUrl: {ReturnUrl}", _settings.ReturnUrl);
            _logger.LogWarning("IpnUrl: {IpnUrl}", _settings.IpnUrl);
            _logger.LogWarning("--- [DEBUG] Kết thúc kiểm tra ---");
        }

        public string CreatePaymentUrl(Payment payment, HttpContext context)
        {
            if (payment == null) throw new ArgumentNullException(nameof(payment));
            if (context == null) throw new ArgumentNullException(nameof(context));
            if (string.IsNullOrEmpty(payment.OrderId)) throw new InvalidOperationException("Payment OrderId is required for VNPay.");

            // Kiểm tra phòng thủ (giữ nguyên)
            string vnp_ReturnUrl = _settings.ReturnUrl;
            string vnp_TmnCode = _settings.TmnCode;
            string vnp_HashSecret = _settings.HashSecret;
            string vnp_Url = _settings.BaseUrl;

            if (string.IsNullOrEmpty(vnp_TmnCode) ||
              string.IsNullOrEmpty(vnp_HashSecret) ||
              string.IsNullOrEmpty(vnp_Url) ||
              string.IsNullOrEmpty(vnp_ReturnUrl))
            {
                throw new InvalidOperationException(
                  "CRITICAL: Cấu hình VNPay (TmnCode, HashSecret, BaseUrl, ReturnUrl) bị thiếu. " +
                  "Không thể tạo URL thanh toán.");
            }

            // ✅ --- BẮT ĐẦU SỬA LỖI TIMEZONE ---
            TimeZoneInfo vietnamZone;
            try
            {
                // ID chuẩn trên Linux (Docker)
                vietnamZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh");
            }
            catch (TimeZoneNotFoundException)
            {
                // ID tương đương trên Windows (cho local dev)
                vietnamZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
            }

            // Chuyển đổi thời gian tạo (đang là UTC) sang giờ Việt Nam (UTC+7)
            DateTime vietnamCreateTime = TimeZoneInfo.ConvertTimeFromUtc(payment.CreatedAt, vietnamZone);
            // Tính thời gian hết hạn (15 phút sau) DỰA TRÊN giờ Việt Nam
            DateTime vietnamExpireTime = vietnamCreateTime.AddMinutes(15);
            // ✅ --- KẾT THÚC SỬA LỖI TIMEZONE ---

            string vnp_IpAddr = GetIpAddress(context) ?? "127.0.0.1";
            string vnp_TxnRef = payment.OrderId;
            long amountInVND = (long)(payment.Amount * 100);

            // Xóa dữ liệu cũ
            _vnPayLibrary.ClearRequestData();

            // Thêm dữ liệu vào request
            _vnPayLibrary.AddRequestData("vnp_Version", _settings.Version);
            _vnPayLibrary.AddRequestData("vnp_Command", _settings.Command);
            _vnPayLibrary.AddRequestData("vnp_TmnCode", vnp_TmnCode);
            _vnPayLibrary.AddRequestData("vnp_Amount", amountInVND.ToString());

            // 👇 SỬA LỖI: Dùng thời gian đã chuyển đổi (vietnamCreateTime)
            _vnPayLibrary.AddRequestData("vnp_CreateDate", vietnamCreateTime.ToString("yyyyMMddHHmmss"));

            _vnPayLibrary.AddRequestData("vnp_CurrCode", _settings.CurrCode);
            _vnPayLibrary.AddRequestData("vnp_IpAddr", vnp_IpAddr);
            _vnPayLibrary.AddRequestData("vnp_Locale", _settings.Locale);
            _vnPayLibrary.AddRequestData("vnp_OrderInfo", $"Thanh toan don hang {vnp_TxnRef}");
            _vnPayLibrary.AddRequestData("vnp_OrderType", "other");
            _vnPayLibrary.AddRequestData("vnp_ReturnUrl", vnp_ReturnUrl);
            _vnPayLibrary.AddRequestData("vnp_TxnRef", vnp_TxnRef);

            // 👇 SỬA LỖI: Dùng thời gian đã chuyển đổi (vietnamExpireTime)
            _vnPayLibrary.AddRequestData("vnp_ExpireDate", vietnamExpireTime.ToString("yyyyMMddHHmmss"));

            // Tạo URL
            string paymentUrl = _vnPayLibrary.CreateRequestUrl(vnp_Url, vnp_HashSecret);

            return paymentUrl;
        }

        public bool ValidateSignature(IQueryCollection vnpayData)
        {
            if (vnpayData == null) return false;

            string? vnp_SecureHash = vnpayData["vnp_SecureHash"].ToString();
            if (string.IsNullOrEmpty(vnp_SecureHash)) return false;

            var dataDict = new SortedList<string, string>(StringComparer.Ordinal);
            foreach (var kvp in vnpayData)
            {
                if (!string.IsNullOrEmpty(kvp.Key) && kvp.Key.StartsWith("vnp_") && kvp.Key != "vnp_SecureHash")
                {
                    dataDict.Add(kvp.Key, kvp.Value.ToString());
                }
            }

            return _vnPayLibrary.ValidateSignature(vnp_SecureHash, _settings.HashSecret, dataDict);
        }

        private string? GetIpAddress(HttpContext context)
        {
            // Ưu tiên header X-Forwarded-For nếu có proxy/load balancer
            string? ipAddress = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();

            if (!string.IsNullOrEmpty(ipAddress) && ipAddress.Contains(','))
            {
                ipAddress = ipAddress.Split(',').FirstOrDefault()?.Trim();
            }

            if (string.IsNullOrEmpty(ipAddress) || ipAddress.Equals("::1", StringComparison.OrdinalIgnoreCase) || ipAddress.ToLowerInvariant() == "unknown")
            {
                ipAddress = context.Connection.RemoteIpAddress?.MapToIPv4().ToString();
            }

            if (ipAddress == "0.0.0.1" || ipAddress == "::1")
            {
                ipAddress = "127.0.0.1";
            }

            return ipAddress;
        }
    }
}