
using CodeForge.Api.DTOs;

namespace CodeForge.Core.Interfaces.Repositories
{
    public interface IModuleService
    {
        Task<List<ModuleDto>> GetAllModuleAsync();
        Task<ModuleDto> GetModuleByIdAsync(Guid moduleId);

        Task<ModuleDto> UpdateModuleAsync(UpdateModuleDto updateModuleDto);
        Task<ModuleDto> CreateModuleAsync(CreateModuleDto createModuleDto);
        Task<bool> DeleteModuleAsync(Guid moduleId);
    }
}