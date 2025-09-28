using AutoMapper;
using CodeForge.Api.DTOs;
using CodeForge.Api.DTOs.Request.Auth;
using CodeForge.Api.DTOs.Request.User;
using CodeForge.Core.Entities;

namespace CodeForge.Core.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // User .
            CreateMap<User, UserDto>();
            CreateMap<RegisterDto, User>();

            // Problem 
            CreateMap<Problem, ProblemDto>();
            CreateMap<CreateProblemDto, Problem>();
            CreateMap<UpdateProblemDto, Problem>();
        }
    }
}
