
using CodeForge.Api.DTOs;
using CodeForge.Core.Entities;

namespace CodeForge.Core.Interfaces.Repositories
{
    public interface IModuleRepository
    {
        Task<List<Module>> GetAllAsync();
        Task<Module?> GetByIdAsync(Guid moduleId);

        Task<Module?> UpdateAsync(UpdateModuleDto updateModuleDto);
        Task<Module> CreateAsync(CreateModuleDto createModuleDto);

        Task<bool> DeleteAsync(Guid moduleId);

        Task<bool> ExistsByTitle(string title);
    }

}