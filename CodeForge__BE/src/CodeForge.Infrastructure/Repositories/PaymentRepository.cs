using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Infrastructure.Data; // Namespace của ApplicationDbContext
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace CodeForge.Infrastructure.Repositories
{
    /// <summary>
    /// Implement interface IPaymentRepository sử dụng EF Core.
    /// </summary>
    public class PaymentRepository : IPaymentRepository
    {
        private readonly ApplicationDbContext _context;

        public PaymentRepository(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }
        public async Task<Payment?> GetPendingPaymentByCourseAsync(Guid userId, Guid courseId)
        {
            return await _context.Payments
                .Where(p => p.UserId == userId &&
                            p.CourseId == courseId &&
                            p.Status == "Pending")
                .FirstOrDefaultAsync();
        }
        public async Task<Payment> AddAsync(Payment payment)
        {
            if (payment == null) throw new ArgumentNullException(nameof(payment));
            await _context.Payments.AddAsync(payment);
            await _context.SaveChangesAsync();
            return payment;
        }

        public async Task<Payment?> GetByIdAsync(Guid paymentId)
        {
            return await _context.Payments.FindAsync(paymentId);
        }

        public async Task<Payment?> GetByOrderIdAsync(string orderId)
        {
            if (string.IsNullOrEmpty(orderId)) return null;

            // Nên có Index trên cột OrderId và PaymentGateway trong DB
            return await _context.Payments
                .FirstOrDefaultAsync(p => p.OrderId == orderId /*&& p.PaymentGateway == "VNPay"*/); // Có thể thêm PaymentGateway nếu OrderId không unique giữa các cổng TT
        }

        public async Task<Payment> UpdateAsync(Payment payment)
        {
            if (payment == null) throw new ArgumentNullException(nameof(payment));
            _context.Entry(payment).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return payment;
        }
    }
}