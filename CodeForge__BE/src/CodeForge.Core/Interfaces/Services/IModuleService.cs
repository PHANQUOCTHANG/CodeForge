
using CodeForge.Api.DTOs;

namespace CodeForge.Core.Interfaces.Repositories
{
    public interface IModuleService
    {
        Task<ApiResponse<List<ModuleDto>>> GetAllModuleAsync();
        Task<ApiResponse<ModuleDto>> GetModuleByIdAsync(Guid moduleId);

        Task<ApiResponse<ModuleDto>> UpdateModuleAsync(UpdateModuleDto updateModuleDto);
        Task<ApiResponse<ModuleDto>> CreateModuleAsync(CreateModuleDto createModuleDto);
        Task<ApiResponse<bool>> DeleteModuleAsync(Guid moduleId);
    }
}