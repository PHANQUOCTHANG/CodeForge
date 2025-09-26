using AutoMapper;

using CodeForge.Api.DTOs.Request.User;
using CodeForge.Core.Entities;
using CodeForge__BE.src.CodeForge.Api.DTOs.Request.Course;
using CodeForge__BE.src.CodeForge.Api.DTOs.Response;

namespace CodeForge.Core.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Entity -> DTO
            //Users
            CreateMap<User, UserDto>();
            CreateMap<UserDto, User>();
            //Course
            CreateMap<Course, CourseDto>();
            CreateMap<createCourseDto, Course>()
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.IsDeleted, opt => opt.MapFrom(src => false));
            CreateMap<updateCourseDto, Course>()
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.IsDeleted, opt => opt.MapFrom(src => false));
        }
    }
}
