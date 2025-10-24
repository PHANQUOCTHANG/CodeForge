using AutoMapper;
using CodeForge.Api.DTOs;
using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Core.Interfaces.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

// ✅ Import Custom Exceptions
using CodeForge.Core.Exceptions;

namespace CodeForge.Core.Service
{
    public class ModuleService : IModuleService // Phải có IModuleService đã sửa
    {
        private readonly IModuleRepository _moduleRepository;
        private readonly IMapper _mapper;

        public ModuleService(IModuleRepository moduleRepository, IMapper mapper)
        {
            _moduleRepository = moduleRepository;
            _mapper = mapper;
        }

        // --- CREATE Module ---
        // ✅ Kiểu trả về mới: Task<ModuleDto>
        public async Task<ModuleDto> CreateModuleAsync(CreateModuleDto createModuleDto)
        {
            // Bỏ khối try-catch
            bool isExistsByTitle = await _moduleRepository.ExistsByTitle(createModuleDto.Title);

            // ✅ SỬA: Thay thế return new ApiResponse<ModuleDto>(404, ...) bằng ConflictException (409)
            if (isExistsByTitle)
            {
                throw new ConflictException($"Module with title '{createModuleDto.Title}' already exists.");
            }

            // Mapping DTO sang Entity và tạo
            Module module = await _moduleRepository.CreateAsync(createModuleDto);

            return _mapper.Map<ModuleDto>(module);
        }

        // --- DELETE Module ---
        // ✅ Kiểu trả về mới: Task<bool>
        public async Task<bool> DeleteModuleAsync(Guid moduleId)
        {
            // Bỏ khối try-catch
            bool result = await _moduleRepository.DeleteAsync(moduleId);

            // ✅ SỬA: Thay thế return new ApiResponse<bool>(404, ...) bằng NotFoundException
            if (!result)
            {
                throw new NotFoundException($"Module with ID {moduleId} not found.");
            }

            return true;
        }

        // --- GET All Module ---
        // ✅ Kiểu trả về mới: Task<List<ModuleDto>>
        public async Task<List<ModuleDto>> GetAllModuleAsync()
        {
            // Bỏ khối try-catch
            List<Module> modules = await _moduleRepository.GetAllAsync();
            return _mapper.Map<List<ModuleDto>>(modules);
        }

        // --- GET Module by ID ---
        // ✅ Kiểu trả về mới: Task<ModuleDto>
        public async Task<ModuleDto> GetModuleByIdAsync(Guid moduleId)
        {
            // Bỏ khối try-catch
            Module? module = await _moduleRepository.GetByIdAsync(moduleId);

            // ✅ SỬA: Thay thế return new ApiResponse<ModuleDto>(404, ...) bằng NotFoundException
            if (module == null)
            {
                throw new NotFoundException($"Module with ID {moduleId} not found.");
            }

            return _mapper.Map<ModuleDto>(module);
        }

        // --- UPDATE Module ---
        // ✅ Kiểu trả về mới: Task<ModuleDto>
        public async Task<ModuleDto> UpdateModuleAsync(UpdateModuleDto updateModuleDto)
        {
            // Bỏ khối try-catch
            bool isExistsByTitle = await _moduleRepository.ExistsByTitle(updateModuleDto.Title);

            // ✅ SỬA: Thay thế return new ApiResponse<ModuleDto>(404, ...) bằng ConflictException
            // Lưu ý: Logic này nên kiểm tra trùng tên của module KHÁC ID
            if (isExistsByTitle)
                throw new ConflictException($"Module with title '{updateModuleDto.Title}' already exists.");

            Module? module = await _moduleRepository.UpdateAsync(updateModuleDto);

            // ✅ SỬA: Thay thế return new ApiResponse<ModuleDto>(404, ...) bằng NotFoundException
            if (module == null)
            {
                throw new NotFoundException($"Module with ID {updateModuleDto.ModuleId} not found for update.");
            }

            return _mapper.Map<ModuleDto>(module);
        }
    }
}