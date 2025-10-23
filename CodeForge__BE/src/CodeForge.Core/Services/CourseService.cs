using AutoMapper;
using CodeForge.Api.DTOs.Response; // Giả định PaginationResult nằm đây
using CodeForge.Core.Entities;
using CodeForge.Api.DTOs.Request.Course;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge__BE.src.CodeForge.Core.Interfaces.Services;
using CodeForge.Core.Models; // Giả định PaginationResult nằm đây
using CodeForge.Core.Helpers; // SlugHelper
using CodeForge.Api.DTOs; // ApiResponse<T>
using CodeForge.Application.DTOs.Courses; // CourseDto, CourseDetailDto
using CodeForge.Core.Exceptions; // ✅ Import Custom Exceptions

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

        // --- GET Paged --- (Không cần sửa)
        public async Task<PaginationResult<object>> GetPagedCoursesAsync(
            int page, int pageSize, string? search)
        {
            var (courses, totalItems) = await _courseRepository.GetPagedCoursesAsync(page, pageSize, search);

            var result = _mapper.Map<IEnumerable<CourseDto>>(courses);

            return new PaginationResult<object>(
                result,
                totalItems,
                page,
                pageSize
            );
        }

        // --- GET Detail by Slug --- (Không cần sửa)
        public async Task<CourseDetailDto?> GetCourseDetailBySlugAsync(string slug)
        {
            var course = await _courseRepository.GetBySlugAsync(slug);
            // ✅ Không ném lỗi 404 trong Service nếu trả về null là chấp nhận được
            if (course == null) return null;
            return _mapper.Map<CourseDetailDto>(course);
        }

        // --- CREATE Course ---
        // ✅ Đổi kiểu trả về từ Task<ApiResponse<CourseDto>> sang Task<CourseDto>
        public async Task<CourseDto> CreateCourseAsync(CreateCourseDto createCourseDto)
        {
            // Bỏ khối try-catch
            bool isExistsByTitle = await _courseRepository.ExistsByTitleAsync(createCourseDto.Title);

            // ✅ SỬA: Thay thế return new ApiResponse<CourseDto>(409, ...) bằng ConflictException
            if (isExistsByTitle)
            {
                throw new ConflictException("Course title already exists.");
            }

            // Sinh slug unique
            string baseSlug = SlugHelper.GenerateSlug(createCourseDto.Title);
            string slug = baseSlug;
            int counter = 1;

            while (await _courseRepository.ExistsBySlugAsync(slug))
                slug = $"{baseSlug}-{counter++}";

            // Gán slug trước khi tạo
            createCourseDto.Slug = slug;

            // Giả định CreateAsync nhận Entity và trả về Entity
            Course course = await _courseRepository.CreateAsync(createCourseDto);

            return _mapper.Map<CourseDto>(course);
        }

        // --- DELETE Course ---
        // ✅ Đổi kiểu trả về từ Task<ApiResponse<bool>> sang Task<bool>
        public async Task<bool> DeleteCourseAsync(Guid courseId)
        {
            // Bỏ khối try-catch
            bool result = await _courseRepository.DeleteAsync(courseId);

            // ✅ SỬA: Thay thế return new ApiResponse<bool>(404, ...) bằng NotFoundException
            if (!result)
            {
                throw new NotFoundException($"Course with ID {courseId} not found.");
            }

            // Chỉ trả về giá trị boolean khi thành công
            return true;
        }

        // --- GET All Course ---
        // ✅ Đổi kiểu trả về từ Task<ApiResponse<List<CourseDto>>> sang Task<List<CourseDto>>
        public async Task<List<CourseDto>> GetAllCourseAsync(QueryParameters query)
        {
            // Bỏ khối try-catch
            List<Course> courses = await _courseRepository.GetAllAsync(query);
            return _mapper.Map<List<CourseDto>>(courses);
        }

        // --- GET Course by ID ---
        // ✅ Đổi kiểu trả về từ Task<ApiResponse<CourseDto>> sang Task<CourseDto>
        public async Task<CourseDto> GetCourseByIdAsync(Guid CourseId)
        {
            // Bỏ khối try-catch
            Course? course = await _courseRepository.GetByIdAsync(CourseId);

            // ✅ SỬA: Thay thế return new ApiResponse<CourseDto>(404, ...) bằng NotFoundException
            if (course == null)
            {
                throw new NotFoundException($"Course with ID {CourseId} not found.");
            }

            return _mapper.Map<CourseDto>(course);
        }

        // --- UPDATE Course ---
        // ✅ Đổi kiểu trả về từ Task<ApiResponse<CourseDto>> sang Task<CourseDto>
        public async Task<CourseDto> UpdateCourseAsync(UpdateCourseDto updateCourseDto)
        {
            // Bỏ khối try-catch

            // Kiểm tra trùng tên: Nếu tên trùng với tên của khóa học KHÁC
            // Cần logic kiểm tra xem Title có trùng với một khóa học khác ID hay không, 
            // hiện tại chỉ kiểm tra trùng tên bất kể ID, có thể gây lỗi nếu người dùng không đổi tên.

            // ✅ SỬA: Thay thế return new ApiResponse<CourseDto>(404, ...) bằng ConflictException (nếu trùng tên)
            // if (isExistsByTitle) throw new ConflictException("Course title already exists.");

            // Giả định UpdateAsync trả về Course đã cập nhật hoặc null
            Course? course = await _courseRepository.UpdateAsync(updateCourseDto);

            // ✅ SỬA: Thay thế return new ApiResponse<CourseDto>(404, ...) bằng NotFoundException
            if (course == null)
            {
                throw new NotFoundException($"Course with ID {updateCourseDto.CourseId} not found.");
            }

            return _mapper.Map<CourseDto>(course);

            // GHI CHÚ: Loại bỏ mã 201 (Created) cho Update. Thao tác Update thường trả về 200 OK.
        }
    }
}