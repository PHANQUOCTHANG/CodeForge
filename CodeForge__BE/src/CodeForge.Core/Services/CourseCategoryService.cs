using AutoMapper;
using CodeForge.Api.DTOs.Request.CourseCategory;
using CodeForge.Api.DTOs.Response;
using CodeForge.Core.Entities;
using CodeForge.Core.Exceptions;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Core.Interfaces.Services;
using System.Collections.Generic;

namespace CodeForge.Core.Service
{
    public class CourseCategoryService : ICourseCategoryService
    {
        private readonly ICourseCategoryRepository _repository;
        private readonly IMapper _mapper;

        public CourseCategoryService(ICourseCategoryRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        // --- GET ALL ---
        public async Task<List<CategoryDto>> GetAllCategoriesAsync()
        {
            var categories = await _repository.GetAllAsync();
            return _mapper.Map<List<CategoryDto>>(categories);
        }

        // --- GET BY ID ---
        public async Task<CategoryDto> GetCategoryByIdAsync(Guid id)
        {
            var category = await _repository.GetByIdAsync(id);
            if (category == null)
                throw new NotFoundException($"Category with ID {id} not found.");

            return _mapper.Map<CategoryDto>(category);
        }

        // --- CREATE ---
        public async Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto dto)
        {
            if (await _repository.ExistsByNameAsync(dto.Name))
                throw new ConflictException($"Category name '{dto.Name}' already exists.");

            var category = _mapper.Map<CourseCategory>(dto);
            var newCategory = await _repository.AddAsync(category);
            return _mapper.Map<CategoryDto>(newCategory);
        }

        // --- UPDATE ---
        public async Task<CategoryDto> UpdateCategoryAsync(UpdateCategoryDto dto)
        {
            var existingCategory = await _repository.GetByIdAsync(dto.CategoryId);
            if (existingCategory == null)
                throw new NotFoundException($"Category with ID {dto.CategoryId} not found.");

            // Kiểm tra trùng tên (nếu tên bị thay đổi)
            if (dto.Name != existingCategory.Name && await _repository.ExistsByNameAsync(dto.Name))
                throw new ConflictException($"Category name '{dto.Name}' already exists.");

            // Ánh xạ DTO lên Entity đang được theo dõi
            _mapper.Map(dto, existingCategory);
            await _repository.UpdateAsync(existingCategory); // Lưu

            return _mapper.Map<CategoryDto>(existingCategory);
        }

        // --- DELETE --- (Soft Delete)
        public async Task<bool> DeleteCategoryAsync(Guid id)
        {
            bool deleted = await _repository.DeleteAsync(id);
            if (!deleted)
                throw new NotFoundException($"Category with ID {id} not found.");

            return true;
        }
    }
}