using AutoMapper;
using CodeForge.Api.DTOs;
using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Repositories;

namespace CodeForge.Core.Service
{
    public class ModuleService : IModuleService
    {

        private readonly IModuleRepository _moduleRepository;
        private readonly IMapper _mapper;

        public ModuleService(IModuleRepository moduleRepository, IMapper mapper)
        {
            _moduleRepository = moduleRepository;
            _mapper = mapper;
        }

        public async Task<ApiResponse<ModuleDto>> CreateModuleAsync(CreateModuleDto createModuleDto)
        {
            try
            {
                bool isExistsByTitle = await _moduleRepository.ExistsByTitle(createModuleDto.Title);
                if (isExistsByTitle)
                {
                    return new ApiResponse<ModuleDto>(404, "Title is exists");
                }
                Module module = await _moduleRepository.CreateAsync(createModuleDto);
                ModuleDto moduleDto = _mapper.Map<ModuleDto>(module);

                return new ApiResponse<ModuleDto>(201, "Create Module success", moduleDto);
            }
            catch (Exception e)
            {
                return new ApiResponse<ModuleDto>(500, e.Message);
            }
        }

        public async Task<ApiResponse<bool>> DeleteModuleAsync(Guid moduleId)
        {
            try
            {
                bool result = await _moduleRepository.DeleteAsync(moduleId);
                if (!result)
                {
                    return new ApiResponse<bool>(404, "Invalid");
                }
                return new ApiResponse<bool>(200, "Delete Module success");
            }
            catch (Exception e)
            {
                return new ApiResponse<bool>(500, e.Message);
            }
        }

        public async Task<ApiResponse<List<ModuleDto>>> GetAllModuleAsync()
        {
            try
            {
                List<Module> modules = await _moduleRepository.GetAllAsync();
                List<ModuleDto> moduleDtos = _mapper.Map<List<ModuleDto>>(modules);

                return new ApiResponse<List<ModuleDto>>(200, "Get all Module success", moduleDtos);
            }
            catch (Exception e)
            {
                return new ApiResponse<List<ModuleDto>>(500, e.Message);
            }
        }

        public async Task<ApiResponse<ModuleDto>> GetModuleByIdAsync(Guid moduleId)
        {
            try
            {
                Module? module = await _moduleRepository.GetByIdAsync(moduleId);

                if (module == null)
                {
                    return new ApiResponse<ModuleDto>(404, "Invalid");
                }

                ModuleDto moduleDto = _mapper.Map<ModuleDto>(module);
                return new ApiResponse<ModuleDto>(200, "Get all Module success", moduleDto);
            }
            catch (Exception e)
            {
                return new ApiResponse<ModuleDto>(500, e.Message);
            }
        }

        public async Task<ApiResponse<ModuleDto>> UpdateModuleAsync(UpdateModuleDto updateModuleDto)
        {
            try
            {
                bool isExistsByTitle = await _moduleRepository.ExistsByTitle(updateModuleDto.Title);
                if (isExistsByTitle) return new ApiResponse<ModuleDto>(404, "Create Module failed");

                Module? module = await _moduleRepository.UpdateAsync(updateModuleDto);

                if (module == null)
                {
                    return new ApiResponse<ModuleDto>(404, "Invalid Module need update");
                }

                ModuleDto moduleDto = _mapper.Map<ModuleDto>(module);

                return new ApiResponse<ModuleDto>(201, "Create Module success", moduleDto);
            }
            catch (Exception e)
            {
                return new ApiResponse<ModuleDto>(500, e.Message);
            }
        }
    }
}