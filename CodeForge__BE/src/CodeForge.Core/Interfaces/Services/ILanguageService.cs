

using CodeForge.Api.DTOs.Request.Language;
using CodeForge.Api.DTOs.Response;

namespace CodeForge.Core.Interfaces.Services
{
    public interface ILanguageService
    {
        Task<IEnumerable<LanguageDto>> GetAllLanguagesAsync();
        Task<LanguageDto> GetLanguageByIdAsync(Guid id);
        Task<LanguageDto> CreateLanguageAsync(CreateLanguageDto dto);
        Task<LanguageDto> UpdateLanguageAsync(Guid id, UpdateLanguageDto dto);
        Task DeleteLanguageAsync(Guid id);
    }
}