using AutoMapper;
using CodeForge.Api.DTOs;
using CodeForge.Api.DTOs.Response;
using CodeForge.Application.DTOs.Modules;
using CodeForge.Core.Entities;
using CodeForge.Core.Exceptions;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Core.Services;

namespace CodeForge.Core.Services
{
    public class ModuleService : IModuleService
    {
        private readonly IModuleRepository _moduleRepository;
        private readonly ICourseRepository _courseRepository;
        private readonly IEnrollmentRepository _enrollmentRepository;
        private readonly IMapper _mapper;

        public ModuleService(
            IModuleRepository moduleRepository,
            ICourseRepository courseRepository,
            IEnrollmentRepository enrollmentRepository,
            IMapper mapper)
        {
            _moduleRepository = moduleRepository;
            _courseRepository = courseRepository;
            _enrollmentRepository = enrollmentRepository;
            _mapper = mapper;
        }

        public async Task<ModuleDto> GetByIdAsync(Guid moduleId, Guid userId)
        {
            var courseId = await _moduleRepository.GetCourseIdByModuleIdAsync(moduleId)
                ?? throw new NotFoundException($"Module với ID {moduleId} không tồn tại.");

            await CheckEnrollmentAsync(courseId, userId);

            var module = await _moduleRepository.GetByIdAsync(moduleId);
            return _mapper.Map<ModuleDto>(module);
        }

        public async Task<List<ModuleDto>> GetByCourseIdAsync(Guid courseId, Guid userId)
        {
            await CheckEnrollmentAsync(courseId, userId);

            var modules = await _moduleRepository.GetByCourseIdAsync(courseId);
            return _mapper.Map<List<ModuleDto>>(modules);
        }

        public async Task<ModuleDto> CreateAsync(CreateModuleDto dto, Guid userId)
        {
            // Chỉ chủ sở hữu khóa học mới được tạo module
            await CheckCourseOwnershipAsync(dto.CourseId, userId);

            var module = _mapper.Map<Module>(dto);
            var newModule = await _moduleRepository.AddAsync(module);
            return _mapper.Map<ModuleDto>(newModule);
        }

        public async Task<ModuleDto> UpdateAsync(UpdateModuleDto dto, Guid userId)
        {
            var courseId = await _moduleRepository.GetCourseIdByModuleIdAsync(dto.ModuleId)
                ?? throw new NotFoundException($"Module với ID {dto.ModuleId} không tồn tại.");

            // Chỉ chủ sở hữu khóa học mới được sửa
            await CheckCourseOwnershipAsync(courseId, userId);

            var module = await _moduleRepository.GetByIdAsync(dto.ModuleId); // Lấy entity đang được track
            _mapper.Map(dto, module); // Cập nhật entity

            var updatedModule = await _moduleRepository.UpdateAsync(module!);
            return _mapper.Map<ModuleDto>(updatedModule);
        }

        public async Task DeleteAsync(Guid moduleId, Guid userId)
        {
            var courseId = await _moduleRepository.GetCourseIdByModuleIdAsync(moduleId)
                ?? throw new NotFoundException($"Module với ID {moduleId} không tồn tại.");

            // Chỉ chủ sở hữu khóa học mới được xóa
            await CheckCourseOwnershipAsync(courseId, userId);

            var module = await _moduleRepository.GetByIdAsync(moduleId);
            await _moduleRepository.DeleteAsync(module!);
        }

        // --- Helper Methods ---

        private async Task CheckEnrollmentAsync(Guid courseId, Guid userId)
        {
            // TODO: Bỏ qua kiểm tra nếu người dùng là Admin hoặc là chủ khóa học
            bool isEnrolled = await _enrollmentRepository.ExistsAsync(userId, courseId);
            if (!isEnrolled)
            {
                throw new ForbiddenException("Bạn phải đăng ký khóa học để xem nội dung này.");
            }
        }

        private async Task CheckCourseOwnershipAsync(Guid courseId, Guid userId)
        {
            // TODO: Bỏ qua kiểm tra nếu là Admin
            var course = await _courseRepository.GetByIdAsync(courseId)
                 ?? throw new NotFoundException($"Khóa học với ID {courseId} không tồn tại.");

            // Schema của bạn dùng 'CreatedBy' làm chủ sở hữu
            if (course.CreatedBy != userId)
            {
                throw new ForbiddenException("Bạn không có quyền chỉnh sửa khóa học này.");
            }
        }
    }
}