using AutoMapper;
using CodeForge.Api.DTOs;
using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Core.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

// ✅ Import Custom Exceptions (Giả định nằm trong CodeForge.Core.Exceptions)
using CodeForge.Core.Exceptions;

namespace CodeForge.Core.Service
{
    // ✅ Chú ý: Đổi kiểu trả về của các phương thức CRUD
    public class LessonService : ILessonService
    {
        private readonly ILessonRepository _lessonRepository;
        private readonly IMapper _mapper;

        public LessonService(ILessonRepository lessonRepository, IMapper mapper)
        {
            _lessonRepository = lessonRepository;
            _mapper = mapper;
        }

        // --- CREATE Lesson ---
        // ✅ Đổi kiểu trả về từ Task<ApiResponse<LessonDto>> sang Task<LessonDto>
        public async Task<LessonDto> CreateLessonAsync(CreateLessonDto createLessonDto)
        {
            // Bỏ khối try-catch
            bool isExistsByTitle = await _lessonRepository.ExistsByTitle(createLessonDto.Title);

            // ✅ SỬA: Thay thế return new ApiResponse<LessonDto>(404, ...) bằng ConflictException (409)
            if (isExistsByTitle)
            {
                throw new ConflictException($"Lesson with title '{createLessonDto.Title}' already exists.");
            }

            // ✅ Mapping DTO sang Entity trước khi tạo
            Lesson lesson = await _lessonRepository.CreateAsync(createLessonDto);

            return _mapper.Map<LessonDto>(lesson);
        }

        // --- DELETE Lesson ---
        // ✅ Đổi kiểu trả về từ Task<ApiResponse<bool>> sang Task<bool>
        public async Task<bool> DeleteLessonAsync(Guid lessonId)
        {
            // Bỏ khối try-catch
            bool result = await _lessonRepository.DeleteAsync(lessonId);

            // ✅ SỬA: Thay thế return new ApiResponse<bool>(404, ...) bằng NotFoundException
            if (!result)
            {
                throw new NotFoundException($"Lesson with ID {lessonId} not found.");
            }

            return true;
        }

        // --- GET All Lesson ---
        // ✅ Đổi kiểu trả về từ Task<ApiResponse<List<LessonDto>>> sang Task<List<LessonDto>>
        public async Task<List<LessonDto>> GetAllLessonAsync()
        {
            // Bỏ khối try-catch
            List<Lesson> lessons = await _lessonRepository.GetAllAsync();
            return _mapper.Map<List<LessonDto>>(lessons);
        }

        // --- GET Lesson by ID ---
        // ✅ Đổi kiểu trả về từ Task<ApiResponse<LessonDto>> sang Task<LessonDto>
        public async Task<LessonDto> GetLessonByIdAsync(Guid lessonId)
        {
            // Bỏ khối try-catch
            Lesson? lesson = await _lessonRepository.GetByIdAsync(lessonId);

            // ✅ SỬA: Thay thế return new ApiResponse<LessonDto>(404, ...) bằng NotFoundException
            if (lesson == null)
            {
                throw new NotFoundException($"Lesson with ID {lessonId} not found.");
            }

            return _mapper.Map<LessonDto>(lesson);
        }

        // --- UPDATE Lesson ---
        // ✅ Đổi kiểu trả về từ Task<ApiResponse<LessonDto>> sang Task<LessonDto>
        public async Task<LessonDto> UpdateLessonAsync(UpdateLessonDto updateLessonDto)
        {
            // Bỏ khối try-catch

            // Logic kiểm tra trùng tên/tiêu đề cần được tinh chỉnh (giống như trong CourseService)
            bool isExistsByTitle = await _lessonRepository.ExistsByTitle(updateLessonDto.Title);

            // ✅ SỬA: Thay thế return new ApiResponse<LessonDto>(404, "Create Lesson failed") bằng ConflictException (409)
            if (isExistsByTitle)
            {
                // Lưu ý: Cần kiểm tra xem Title có thuộc về Lesson khác hay không
                throw new ConflictException($"Lesson with title '{updateLessonDto.Title}' already exists.");
            }

            // Giả định UpdateAsync nhận DTO và trả về Entity đã cập nhật
            Lesson? lesson = await _lessonRepository.UpdateAsync(updateLessonDto);

            // ✅ SỬA: Thay thế return new ApiResponse<LessonDto>(404, ...) bằng NotFoundException
            if (lesson == null)
            {
                throw new NotFoundException($"Lesson with ID {updateLessonDto.LessonId} not found for update.");
            }

            return _mapper.Map<LessonDto>(lesson);
        }
    }
}