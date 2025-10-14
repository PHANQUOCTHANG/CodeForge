using AutoMapper;
using CodeForge.Api.DTOs;
using CodeForge.Api.DTOs.Request.Auth;
using CodeForge.Api.DTOs.Request.Course;
using CodeForge.Api.DTOs.Request.User;
using CodeForge.Api.DTOs.Response;
using CodeForge.Core.Entities;
using CodeForge.Api.DTOs.Request.Course;


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

            //Course
            CreateMap<Course, CourseDto>();
            CreateMap<CreateCourseDto, Course>()
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.IsDeleted, opt => opt.MapFrom(src => false));
            CreateMap<UpdateCourseDto, Course>()
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.IsDeleted, opt => opt.MapFrom(src => false));

            //Module 
            CreateMap<Module, ModuleDto>();
            CreateMap<CreateModuleDto, Module>();
            CreateMap<UpdateModuleDto, Module>();
        }
    }
}
