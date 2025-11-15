using AutoMapper;
using CodeForge.Core.Entities;
using CodeForge.Api.DTOs.Response;
using CodeForge.Application.DTOs.Modules;
using CodeForge.Application.DTOs.Lessons; // Giả định DTOs Lesson
using CodeForge.Api.DTOs.Request.Enrollment;
using CodeForge.Application.DTOs.Response;
using CodeForge.Api.DTOs;
using CodeForge.Api.DTOs.Request.Course;
using CodeForge.Api.DTOs.Request.Auth;
using CodeForge.Application.DTOs.Request.CourseCategory; // Giả định DTOs Problem

namespace CodeForge.Core.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // =======================================================
            // 1. USER & AUTH
            // =======================================================

            // User Summary/Public DTO (Sử dụng cho Reviewer, Course Creator)
            CreateMap<User, UserSummaryDto>();

            // User DTO đầy đủ (Có thể chứa Role, Status, v.v., KHÔNG chứa PasswordHash)
            CreateMap<User, UserDto>();
            CreateMap<RegisterDto, User>();

            // =======================================================
            // 2. COURSE & MODULES
            // =======================================================

            // ✅ Course -> CourseDto: Ánh xạ từ các Navigation Properties (Cần .Include trong Repo)
            CreateMap<Course, CourseDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.Author, opt => opt.MapFrom(src => src.User.Username));

            CreateMap<Course, CourseDetailDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.Author, opt => opt.MapFrom(src => src.User.Username));

            CreateMap<CreateCourseDto, Course>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.IsDeleted, opt => opt.MapFrom(src => false));

            CreateMap<UpdateCourseDto, Course>(); // Không cần .ForMember cho CreatedAt, chỉ cần cập nhật UpdatedAt (Qua AuditableEntity/DbContext)

            // Module
            CreateMap<Module, ModuleDto>();
            CreateMap<CreateModuleDto, Module>();
            CreateMap<UpdateModuleDto, Module>();
            //Course Category
            CreateMap<CourseCategory, CategoryDto>();
            CreateMap<CreateCategoryDto, CourseCategory>();
            CreateMap<UpdateCategoryDto, CourseCategory>();


            // =======================================================
            // 3. LESSONS & QUIZZES
            // =======================================================

            // Lesson (Ánh xạ các nội dung lồng nhau)
            CreateMap<Lesson, LessonDto>()
                .ForMember(dest => dest.VideoContent, opt => opt.MapFrom(src => src.LessonVideo))
                .ForMember(dest => dest.TextContent, opt => opt.MapFrom(src => src.LessonText))
                .ForMember(dest => dest.QuizContent, opt => opt.MapFrom(src => src.LessonQuiz));

            // DTOs nội dung
            CreateMap<LessonVideo, LessonVideoDto>();
            CreateMap<LessonText, LessonTextDto>();
            CreateMap<LessonQuiz, LessonQuizDto>();
            CreateMap<QuizQuestion, QuizQuestionDto>();

            // =======================================================
            // 4. PROBLEMs & TEST CASES
            // =======================================================

            // Problem
            CreateMap<Problem, ProblemDto>();
            CreateMap<CreateProblemDto, Problem>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.IsDeleted, opt => opt.MapFrom(src => false));
            CreateMap<UpdateProblemDto, Problem>();

            // Test Case
            CreateMap<TestCase, TestCaseDto>();
            CreateMap<CreateTestCaseDto, TestCase>();
            CreateMap<UpdateTestCaseDto, TestCase>();

            // Submission (Tùy chọn: cần thêm DTOs Submission nếu cần)
            // CreateMap<CreateSubmissionDto, Submission>();
            // CreateMap<Submission, SubmissionDto>();

            // =======================================================
            // 5. ENROLLMENT & PROGRESS
            // =======================================================

            CreateMap<Enrollment, EnrollmentDto>();
            // CreateMap<EnrollmentRequestDto, Enrollment>(); // Chỉ dùng cho Service/Controller, không cần DTO->Entity

            // Progress
            CreateMap<Progress, ProgressDto>();
            // CreateMap<UpdateProgressRequestDto, Progress>();

            // =======================================================
            // 6. COURSE REVIEW (FIX MAPPING LỒNG NHAU)
            // =======================================================

            CreateMap<CreateReviewDto, CourseReview>();
            CreateMap<UpdateReviewDto, CourseReview>();

            // ✅ FIX: Ánh xạ Entity CourseReview sang DTO CourseReviewDto
            CreateMap<CourseReview, CourseReviewDto>()
                // Ánh xạ Navigation Property User (Entity) sang User DTO lồng nhau
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User));

            // ✅ FIX: Đảm bảo User DTO được map sang UserSummaryDto (hoặc UserDto)
            // Nếu CourseReviewDto.User là UserDto, thì nó sẽ sử dụng mapping User -> UserDto đã có.


        }
    }
}