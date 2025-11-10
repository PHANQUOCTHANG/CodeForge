using CodeForge.Core.Entities;

namespace CodeForge.Core.Interfaces.Repositories
{
    public interface IEnrollmentRepository
    {
        Task<Enrollment> AddAsync(Enrollment enrollment);
        Task<Enrollment?> GetByUserIdAndCourseIdAsync(Guid userId, Guid courseId);
        Task<List<Enrollment>> GetByUserIdAsync(Guid userId);
        Task DeleteAsync(Enrollment enrollment);
        Task<bool> ExistsAsync(Guid userId, Guid courseId);

        // ✅ Chuyển phương thức này TỪ ICourseRepository SANG ĐÂY
        Task<List<Guid>> GetUserEnrolledCourseIdsAsync(Guid userId);
    }
}