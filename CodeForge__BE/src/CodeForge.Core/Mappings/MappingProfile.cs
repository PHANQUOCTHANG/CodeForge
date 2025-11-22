using AutoMapper;
using CodeForge.Core.Entities;
using CodeForge.Api.DTOs.Response;

using CodeForge.Api.DTOs.Request.Enrollment;

using CodeForge.Api.DTOs;
using CodeForge.Api.DTOs.Request.Course;
using CodeForge.Api.DTOs.Request.Auth;

using UserProfile = CodeForge.Core.Entities.Profile;
using CodeForge.Api.DTOs.Request.User;
using CodeForge.Api.DTOs.Modules;
using CodeForge.Api.DTOs.Request.CourseCategory;
using CodeForge.Api.DTOs.Lessons;
using CodeForge.Api.DTOs.Request.Language;
using CodeForge.Application.DTOs.Request.CourseCategory;
using CodeForge.Api.DTOs.Request; // Giả định DTOs Problem

namespace CodeForge.Core.Mappings
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            // =======================================================
            // 1. USER & AUTH
            // =======================================================

            // User Summary/Public DTO (Sử dụng cho Reviewer, Course Creator)
            CreateMap<User, UserSummaryDto>();
            // Map Entity -> DTO
            CreateMap<User, UserDto>()
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.Profile.FullName))
                .ForMember(dest => dest.Avatar, opt => opt.MapFrom(src => src.Profile.Avatar));
            // User DTO đầy đủ (Có thể chứa Role, Status, v.v., KHÔNG chứa PasswordHash)
            // MappingProfile.cs
            CreateMap<User, UserDto>()
                // Lấy FullName từ Profile nhét vào UserDto
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.Profile.FullName))
                .ForMember(dest => dest.Avatar, opt => opt.MapFrom(src => src.Profile.Avatar));
            CreateMap<RegisterDto, User>();
            CreateMap<CreateUserDto, User>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => "active")); // Mặc định active
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
                .ForMember(dest => dest.IsDeleted, opt => opt.MapFrom(src => false))
                // 👇 DÒNG QUAN TRỌNG NHẤT: Bỏ qua Modules để không bị map tự động
                .ForMember(dest => dest.Modules, opt => opt.Ignore());

            CreateMap<UpdateCourseDto, Course>()
                .ForMember(dest => dest.CourseId, opt => opt.Ignore())  // Chặn sửa ID
                .ForMember(dest => dest.Modules, opt => opt.Ignore()) // 👈 QUAN TRỌNG: Tự xử lý list này
                .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.IsDeleted, opt => opt.Ignore()); // (Nên thêm) Chặn sửa cờ xóa

            // Module
            CreateMap<Module, ModuleDto>();
            CreateMap<CreateModuleDto, Module>();
            CreateMap<UpdateModuleDto, Module>()
                .ForMember(dest => dest.Lessons, opt => opt.Ignore()); // 👈 QUAN TRỌNG
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
            // Mapping từ CreateLessonDto sang Lesson và các nội dung lồng nhau
            CreateMap<CreateLessonDto, Lesson>();
            CreateMap<CreateLessonVideoDto, LessonVideo>();
            CreateMap<CreateLessonTextDto, LessonText>();
            CreateMap<CreateLessonQuizDto, LessonQuiz>();
            CreateMap<CreateQuizQuestionDto, QuizQuestion>();
            CreateMap<CreateCodingProblemDto, Problem>();
            //update Mapping từ UpdateLessonDto sang Lesson và các nội dung lồng nhau
            CreateMap<UpdateLessonDto, Lesson>();
            CreateMap<UpdateLessonVideoDto, LessonVideo>();
            CreateMap<UpdateLessonTextDto, LessonText>();
            CreateMap<UpdateLessonQuizDto, LessonQuiz>();
            CreateMap<UpdateQuizQuestionDto, QuizQuestion>();
            CreateMap<UpdateCodingProblemDto, Problem>();

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
            CreateMap<CreateSubmissionDto, Submission>();
            CreateMap<Submission, SubmissionDto>();

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
            //Lan guage
            // Language Maps
            CreateMap<LanguageEntity, LanguageDto>();
            CreateMap<CreateLanguageDto, LanguageEntity>();
            CreateMap<UpdateLanguageDto, LanguageEntity>();

        }
    }
}