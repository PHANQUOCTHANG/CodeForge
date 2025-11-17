using CodeForge.Api.DTOs.Response;
using CodeForge.Api.DTOs.Request;

namespace CodeForge.Application.Interfaces
{
    public interface IProfileService
    {
        Task<ProfileDto?> GetByUserIdAsync(Guid userId);
        Task<ProfileDto?> GetByIdAsync(Guid profileId);
        Task<IEnumerable<ProfileDto>> GetAllAsync();
        Task<ProfileDto> CreateAsync(ProfileRequestDto dto);
        Task<ProfileDto?> UpdateAsync(Guid profileId, ProfileRequestDto dto);
        Task<bool> DeleteAsync(Guid profileId);
    }
}
