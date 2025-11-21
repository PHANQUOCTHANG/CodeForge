using System.ComponentModel.DataAnnotations;
using CodeForge.Api.DTOs;
using CodeForge.Application.DTOs.Lessons;

namespace CodeForge.Application.DTOs.Modules
{
    public class UpdateModuleDto
    {
        public Guid? ModuleId { get; set; } // Nullable: Nếu null -> Tạo mới
        public string Title { get; set; } = string.Empty;
        public int OrderIndex { get; set; }
        public bool IsDeleted { get; set; } = false;
        public List<UpdateLessonDto> Lessons { get; set; } = new List<UpdateLessonDto>();
    }
}