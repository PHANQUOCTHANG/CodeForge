
using AutoMapper;
using CodeForge.Api.DTOs;
using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CodeForge.Infrastructure.Repositories
{
    public class ModuleRepository : IModuleRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public ModuleRepository(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Module> CreateAsync(CreateModuleDto createModuleDto)
        {
            Module newModule = _mapper.Map<Module>(createModuleDto);
            _context.Modules.Add(newModule);
            await _context.SaveChangesAsync();
            return newModule;
        }

        public async Task<bool> DeleteAsync(Guid moduleId)
        {
            Module? module = await _context.Modules.FindAsync(moduleId);
            if (module == null) return false;
            _context.Modules.Remove(module);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Module>> GetAllAsync()
        {
            return await _context.Modules.Include(c=>c.Course).ToListAsync();
        }

        public async Task<Module?> GetByIdAsync(Guid moduleId)
        {
            return await _context.Modules.FindAsync(moduleId);
        }

        public async Task<Module?> UpdateAsync(UpdateModuleDto updateModuleDto)
        {
            Module? module = await _context.Modules.FindAsync(updateModuleDto.ModuleId);

            if (module == null)
                return null;

            // Map các property từ DTO sang entity đang được track
            _mapper.Map(updateModuleDto, module);

            await _context.SaveChangesAsync();
            return module;
        }

        public async Task<bool> ExistsByTitle(string title)
        {
            Module? module = await _context.Modules.FirstOrDefaultAsync(p => p.Title == title);
            return module != null;
        }
    }
}