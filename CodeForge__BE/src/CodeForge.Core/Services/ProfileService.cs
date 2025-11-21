using AutoMapper;
using CodeForge.Api.DTOs.Request;
using CodeForge.Api.DTOs.Response;
using CodeForge.Application.Interfaces;
using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces;
using Profile = CodeForge.Core.Entities.Profile;

namespace CodeForge.Application.Services
{
    public class ProfileService : IProfileService
    {
        private readonly IProfileRepository _profileRepo;
        private readonly IMapper _mapper;

        public ProfileService(IProfileRepository profileRepo, IMapper mapper)
        {
            _profileRepo = profileRepo;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ProfileDto>> GetAllAsync()
        {
            var data = await _profileRepo.GetAllAsync();
            return _mapper.Map<IEnumerable<ProfileDto>>(data);
        }

        public async Task<ProfileDto?> GetByUserIdAsync(Guid userId)
        {
            var profile = await _profileRepo.GetByUserIdAsync(userId);
            return _mapper.Map<ProfileDto>(profile);
        }

        public async Task<ProfileDto?> GetByIdAsync(Guid profileId)
        {
            var profile = await _profileRepo.GetByIdAsync(profileId);
            return _mapper.Map<ProfileDto>(profile);
        }

        public async Task<ProfileDto> CreateAsync(ProfileRequestDto dto)
        {
            var profile = _mapper.Map<Profile>(dto);
            await _profileRepo.AddAsync(profile);
            await _profileRepo.SaveChangesAsync();
            return _mapper.Map<ProfileDto>(profile);
        }

        public async Task<ProfileDto?> UpdateAsync(Guid profileId, ProfileRequestDto dto)
        {
            var profile = await _profileRepo.GetByIdAsync(profileId);
            if (profile == null) return null;

            _mapper.Map(dto, profile);
            await _profileRepo.UpdateAsync(profile);
            await _profileRepo.SaveChangesAsync();

            return _mapper.Map<ProfileDto>(profile);
        }

        public async Task<bool> DeleteAsync(Guid profileId)
        {
            var profile = await _profileRepo.GetByIdAsync(profileId);
            if (profile == null) return false;

            await _profileRepo.DeleteAsync(profileId);
            await _profileRepo.SaveChangesAsync();
            return true;
        }
    }
}
