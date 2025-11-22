using AutoMapper;
using CodeForge.Api.DTOs.Request.Language;
using CodeForge.Api.DTOs.Response;
using CodeForge.Core.Entities;
using CodeForge.Core.Exceptions; // Giả sử bạn có NotFoundException, ConflictException
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Core.Interfaces.Services;

namespace CodeForge.Core.Services
{
    public class LanguageService : ILanguageService
    {
        private readonly ILanguageRepository _languageRepository;
        private readonly IMapper _mapper;

        public LanguageService(ILanguageRepository languageRepository, IMapper mapper)
        {
            _languageRepository = languageRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<LanguageDto>> GetAllLanguagesAsync()
        {
            var languages = await _languageRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<LanguageDto>>(languages);
        }

        public async Task<LanguageDto> GetLanguageByIdAsync(Guid id)
        {
            var language = await _languageRepository.GetByIdAsync(id);
            if (language == null)
                throw new NotFoundException($"Language with ID {id} not found.");

            return _mapper.Map<LanguageDto>(language);
        }

        public async Task<LanguageDto> CreateLanguageAsync(CreateLanguageDto dto)
        {
            // Check trùng tên
            if (await _languageRepository.ExistsByNameAsync(dto.Name))
            {
                throw new ConflictException($"Language '{dto.Name}' already exists.");
            }

            var entity = _mapper.Map<LanguageEntity>(dto);
            entity.LanguageID = Guid.NewGuid();
            entity.IsDeleted = false;

            await _languageRepository.AddAsync(entity);

            return _mapper.Map<LanguageDto>(entity);
        }

        public async Task<LanguageDto> UpdateLanguageAsync(Guid id, UpdateLanguageDto dto)
        {
            var existingLanguage = await _languageRepository.GetByIdAsync(id);
            if (existingLanguage == null)
                throw new NotFoundException($"Language with ID {id} not found.");

            // Check trùng tên nếu đổi tên (và tên mới khác tên cũ)
            if (existingLanguage.Name != dto.Name && await _languageRepository.ExistsByNameAsync(dto.Name))
            {
                throw new ConflictException($"Language '{dto.Name}' already exists.");
            }

            _mapper.Map(dto, existingLanguage); // Map đè dữ liệu mới vào entity cũ
            
            await _languageRepository.UpdateAsync(existingLanguage);

            return _mapper.Map<LanguageDto>(existingLanguage);
        }

        public async Task DeleteLanguageAsync(Guid id)
        {
            var language = await _languageRepository.GetByIdAsync(id);
            if (language == null)
                throw new NotFoundException($"Language with ID {id} not found.");

            // Soft Delete
            language.IsDeleted = true;
            await _languageRepository.UpdateAsync(language);
        }
    }
}