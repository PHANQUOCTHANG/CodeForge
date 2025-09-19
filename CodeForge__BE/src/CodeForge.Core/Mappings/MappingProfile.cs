using AutoMapper;

using CodeForge.Api.DTOs.Request.User;
using CodeForge.Core.Entities;

namespace CodeForge.Core.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Entity -> DTO
            CreateMap<User, UserDto>();
            CreateMap<UserDto, User>();
        }
    }
}
