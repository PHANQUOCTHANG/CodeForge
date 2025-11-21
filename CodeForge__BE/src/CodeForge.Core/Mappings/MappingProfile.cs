
using AutoMapper;
using CodeForge.Api.DTOs;
using CodeForge.Api.DTOs.Request;
using CodeForge.Api.DTOs.Request.Auth;
using CodeForge.Api.DTOs.Request.Course;
using CodeForge.Api.DTOs.Request.Enrollment;
using CodeForge.Api.DTOs.Request.User;
using CodeForge.Api.DTOs.Response;
using CodeForge.Api.Helpers;
using CodeForge.Application.DTOs.Modules;
using CodeForge.Application.DTOs.Response;
using CodeForge.Core.Entities;
using Profile = AutoMapper.Profile;


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
            CreateMap<Problem, UpdateProblemDto>();

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
            CreateMap<Lesson, LessonDto>()
            .ForMember(
                dest => dest.VideoContent, // Tên DTO
                opt => opt.MapFrom(src => src.LessonVideo) // Tên Entity
            )
            .ForMember(
                dest => dest.TextContent, // Tên DTO
                opt => opt.MapFrom(src => src.LessonText) // Tên Entity
            )
            .ForMember(
                dest => dest.QuizContent, // Tên DTO
                opt => opt.MapFrom(src => src.LessonQuiz) // Tên Entity
            );
            // (CodingProblem không cần vì tên đã giống nhau)
            // Đảm bảo bạn CŨNG CÓ map cho các DTO con (nếu chưa có)
            CreateMap<LessonVideo, LessonVideoDto>();
            CreateMap<LessonText, LessonTextDto>();
            CreateMap<LessonQuiz, LessonQuizDto>();
            CreateMap<QuizQuestion, QuizQuestionDto>();
            //Enrollment
            CreateMap<Enrollment, EnrollmentDto>();
            //Progress
            CreateMap<Progress, ProgressDto>();
            CreateMap<UpdateProgressRequestDto, Progress>();
            //Enrollment
            CreateMap<Enrollment, EnrollmentDto>();
            CreateMap<EnrollmentRequestDto, Enrollment>();
            //problem
            CreateMap<Problem, ProblemDto>();

            //Module 
            CreateMap<TestCase, TestCaseDto>();

            // TestCase 
            CreateMap<CreateTestCaseDto, TestCase>();
            CreateMap<UpdateTestCaseDto, TestCase>();

            // Submission 
            CreateMap<CreateSubmissionDto, Submission>();
            CreateMap<Submission, SubmissionDto>();

            // Profile
            CreateMap<ProfileRequestDto, Profile>();
            CreateMap<Profile, ProfileDto>();
            CreateMap<Profile, ProfileRequestDto>()
                .ForAllMembers(opts => opts.Condition((src, dest, value) => value != null));
            
            // DiscussionThread
            CreateMap<DiscussionThread, ThreadDto>()
                .ForMember(dest => dest.Author, opt => opt.MapFrom(src => 
                    src.User != null ? src.User.Username : "Unknown"))
                .ForMember(dest => dest.Avatar, opt => opt.MapFrom(src => 
                    src.User != null && src.User.Profile != null 
                        ? src.User.Profile.Avatar 
                        : ""))
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => 
                    src.User != null ? src.User.Role : ""))
                .ForMember(dest => dest.TimeAgo, opt => opt.MapFrom(src => 
                    TimeAgoHelper.GetTimeAgo(src.CreatedAt)))
                .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => 
                    src.ImageUrl ?? ""))
                .ForMember(dest => dest.Tags, opt => opt.MapFrom(src => 
                    JsonHelper.ParseTags(src.Tags)))
                .ForMember(dest => dest.Likes, opt => opt.MapFrom(src => 
                    src.Likes))
                .ForMember(dest => dest.Shares, opt => opt.MapFrom(src => 
                    src.Shares))
                .ForMember(dest => dest.Comments, opt => opt.MapFrom(src => 
                    src.Comments != null ? src.Comments.Count : 0));

            // Comment
        }
    }
}
