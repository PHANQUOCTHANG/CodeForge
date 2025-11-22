

using CodeForge.Api.DTOs.Response;

namespace CodeForge.Api.DTOs.Response
{
    public class ModuleDto
    {
        public Guid ModuleId { get; set; }
        public Guid CourseId { get; set; }
        public string Title { get; set; } = string.Empty;
        public int OrderIndex { get; set; }
        public bool IsDeleted { get; set; } = false;
        /// <summary>
        /// Danh sách các bài học thuộc chương này.
        /// </summary>
        public List<LessonDto> Lessons { get; set; } = new List<LessonDto>();

        // Bạn cũng cần tạo LessonSummaryDto (một phiên bản rút gọn của LessonDto)
        // để tránh load quá nhiều dữ liệu không cần thiết trong danh sách.
    }
}