
using AutoMapper;
using CodeForge.Api.DTOs.Response;
using CodeForge.Core.Entities;
using CodeForge.Api.DTOs.Request.Course;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge__BE.src.CodeForge.Core.Interfaces.Services;

namespace CodeForge__BE.src.CodeForge.Core.Services
{
    public class CourseService : ICourseService
    {
        private readonly ICourseRepository _courseRepository;
        private readonly IMapper _mapper;

        public CourseService(ICourseRepository courseRepository, IMapper mapper)
        {
            _courseRepository = courseRepository;
            _mapper = mapper;
        }

        public async Task<ApiResponse<CourseDto>> CreateCourseAsync(CreateCourseDto createCourseDto)
        {
            try
            {
                bool isExistsByTitle = await _courseRepository.ExistsByTitle(createCourseDto.Title);
                if (isExistsByTitle)
                {
                    return new ApiResponse<CourseDto>(404, "Title is exists");
                }
                Course course = await _courseRepository.CreateAsync(createCourseDto);
                CourseDto courseDto = _mapper.Map<CourseDto>(course);

                return new ApiResponse<CourseDto>(201, "Create Course success", courseDto);
            }
            catch (Exception e)
            {
                return new ApiResponse<CourseDto>(500, e.Message);
            }
        }

        public async Task<ApiResponse<bool>> DeleteCourseAsync(Guid courseId)
        {
            try
            {
                bool result = await _courseRepository.DeleteAsync(courseId);
                if (!result)
                {
                    return new ApiResponse<bool>(404, "Invalid");
                }
                return new ApiResponse<bool>(200, "Delete Course success");
            }
            catch (Exception e)
            {
                return new ApiResponse<bool>(500, e.Message);
            }
        }

        public async Task<ApiResponse<List<CourseDto>>> GetAllCourseAsync(QueryParameters query)
        {
            try
            {
                List<Course> courses = await _courseRepository.GetAllAsync(query);
                List<CourseDto> courseDtos = _mapper.Map<List<CourseDto>>(courses);

                return new ApiResponse<List<CourseDto>>(200, "Get all Course success", courseDtos);
            }
            catch (Exception e)
            {
                return new ApiResponse<List<CourseDto>>(500, e.Message);
            }
        }

        public async Task<ApiResponse<CourseDto>> GetCourseByIdAsync(Guid CourseId)
        {
            try
            {
                Course? course = await _courseRepository.GetByIdAsync(CourseId);

                if (course == null)
                {
                    return new ApiResponse<CourseDto>(404, "Invalid");
                }

                CourseDto courseDto = _mapper.Map<CourseDto>(course);
                return new ApiResponse<CourseDto>(200, "Get all Course success", courseDto);
            }
            catch (Exception e)
            {
                return new ApiResponse<CourseDto>(500, e.Message);
            }
        }

        public async Task<ApiResponse<CourseDto>> UpdateCourseAsync(UpdateCourseDto updateCourseDto)
        {
            try
            {
                bool isExistsByTitle = await _courseRepository.ExistsByTitle(updateCourseDto.Title);
                if (isExistsByTitle) return new ApiResponse<CourseDto>(404, "Create Course failed");

                Course? course = await _courseRepository.UpdateAsync(updateCourseDto);

                if (course == null)
                {
                    return new ApiResponse<CourseDto>(404, "Invalid Course need update");
                }

                CourseDto courseDto = _mapper.Map<CourseDto>(course);

                return new ApiResponse<CourseDto>(201, "Create Course success", courseDto);
            }
            catch (Exception e)
            {
                return new ApiResponse<CourseDto>(500, e.Message);
            }
        }
    }
}