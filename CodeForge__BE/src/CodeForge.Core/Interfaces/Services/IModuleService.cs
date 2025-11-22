using CodeForge.Api.DTOs;
using CodeForge.Api.DTOs.Modules;
using CodeForge.Api.DTOs.Response;


namespace CodeForge.Core.Services
{
    public interface IModuleService
    {
        Task<ModuleDto> GetByIdAsync(Guid moduleId, Guid userId);
        Task<List<ModuleDto>> GetByCourseIdAsync(Guid courseId, Guid userId);
        Task<ModuleDto> CreateAsync(CreateModuleDto dto, Guid userId);
        Task<ModuleDto> UpdateAsync(UpdateModuleDto dto, Guid userId);
        Task DeleteAsync(Guid moduleId, Guid userId);
    }
}