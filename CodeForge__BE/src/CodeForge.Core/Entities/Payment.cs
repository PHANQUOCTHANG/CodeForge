using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodeForge.Core.Entities
{
    /// <summary>
    /// Lưu trữ thông tin về một giao dịch thanh toán.
    /// </summary>
    public class Payment
    {
        [Key]
        public Guid PaymentId { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [Required]
        public Guid CourseId { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [Required]
        [StringLength(10)]
        public string Currency { get; set; } = "VND";

        [StringLength(50)]
        public string? PaymentMethod { get; set; } // Ví dụ: "VNPay QR", "VNPay NAPAS", "Stripe Card"

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Pending"; // Pending, Succeeded, Failed

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? PaidAt { get; set; }

        /// <summary>
        /// Mã giao dịch duy nhất từ cổng thanh toán (ví dụ: vnp_TransactionNo).
        /// </summary>
        [StringLength(255)]
        public string? TransactionId { get; set; }

        /// <summary>
        /// Mã đơn hàng duy nhất của hệ thống gửi cho cổng thanh toán (ví dụ: vnp_TxnRef).
        /// </summary>
        [StringLength(255)]
        [Required] // Nên yêu cầu có khi tạo payment cho VNPay
        public string OrderId { get; set; } = string.Empty;

        /// <summary>
        /// Tên cổng thanh toán được sử dụng (ví dụ: "VNPay", "Stripe").
        /// </summary>
        [Required]
        [StringLength(50)]
        public string PaymentGateway { get; set; } = string.Empty;

        // Navigation properties
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;

        [ForeignKey("CourseId")]
        public virtual Course Course { get; set; } = null!;
    }
}