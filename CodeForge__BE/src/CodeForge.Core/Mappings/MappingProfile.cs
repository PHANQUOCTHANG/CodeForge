using AutoMapper;
using CodeForge.Api.DTOs;
using CodeForge.Api.DTOs.Request.Auth;
using CodeForge.Api.DTOs.Request.Course;
using CodeForge.Api.DTOs.Request.User;
using CodeForge.Api.DTOs.Response;
using CodeForge.Application.DTOs.Courses;
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
            CreateMap<CreateProblemDto, Problem>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.IsDeleted, opt => opt.MapFrom(src => false));
            CreateMap<UpdateProblemDto, Problem>();

            //Course
            CreateMap<Course, CourseDto>()
            .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
            .ForMember(dest => dest.Author, opt => opt.MapFrom(src => src.User.Username));

            CreateMap<Course, CourseDetailDto>()
            .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
            .ForMember(dest => dest.Author, opt => opt.MapFrom(src => src.User.Username));

            CreateMap<CreateCourseDto, Course>()
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.IsDeleted, opt => opt.MapFrom(src => false));

            CreateMap<UpdateCourseDto, Course>()
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.IsDeleted, opt => opt.MapFrom(src => false));

            CreateMap<CourseReview, CourseReviewDto>();

            //Module 
            CreateMap<Module, ModuleDto>();
            CreateMap<CreateModuleDto, Module>();
            CreateMap<UpdateModuleDto, Module>();

            //lesson
            CreateMap<Lesson, LessonDto>();

            //problem
            CreateMap<Problem, ProblemDto>();
            //TestCase
            //Module 
            CreateMap<TestCase, TestCaseDto>();
            CreateMap<CreateTestCaseDto, TestCase>();
            CreateMap<UpdateTestCaseDto, TestCase>();
        }
    }
}
