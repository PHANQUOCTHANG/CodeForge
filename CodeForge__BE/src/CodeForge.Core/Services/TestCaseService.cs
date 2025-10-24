using AutoMapper;
using CodeForge.Api.DTOs;
using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Core.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

// ✅ Import Custom Exceptions
using CodeForge.Core.Exceptions;
using CodeForge.Api.DTOs.Response; // Giả định DTOs nằm ở đây

namespace CodeForge.Core.Service
{
    public class TestCaseService : ITestCaseService // ITestCaseService phải được cập nhật
    {
        private readonly ITestCaseRepository _TestCaseRepository;
        private readonly IMapper _mapper;

        public TestCaseService(ITestCaseRepository TestCaseRepository, IMapper mapper)
        {
            _TestCaseRepository = TestCaseRepository;
            _mapper = mapper;
        }

        // --- CREATE TestCase ---
        // ✅ Kiểu trả về mới: Task<TestCaseDto>
        public async Task<TestCaseDto> CreateTestCaseAsync(CreateTestCaseDto createTestCaseDto)
        {
            // Bỏ khối try-catch và ApiResponse<T>

            // Nếu có logic kiểm tra trùng lặp (ví dụ: Input/Output trùng nhau), hãy thêm ConflictException ở đây

            // Mapping DTO sang Entity và tạo
            TestCase testCase = await _TestCaseRepository.CreateAsync(createTestCaseDto);

            return _mapper.Map<TestCaseDto>(testCase);
        }

        // --- DELETE TestCase ---
        // ✅ Kiểu trả về mới: Task<bool>
        public async Task<bool> DeleteTestCaseAsync(Guid testCaseId)
        {
            // Bỏ khối try-catch
            bool result = await _TestCaseRepository.DeleteAsync(testCaseId);

            // ✅ SỬA: Thay thế return new ApiResponse<bool>(404, ...) bằng NotFoundException
            if (!result)
            {
                throw new NotFoundException($"TestCase with ID {testCaseId} not found.");
            }

            return true;
        }

        // --- GET All TestCase ---
        // ✅ Kiểu trả về mới: Task<List<TestCaseDto>>
        public async Task<List<TestCaseDto>> GetAllTestCaseAsync(bool? isHiden)
        {
            // Bỏ khối try-catch và ApiResponse<T>
            List<TestCase> testCases = await _TestCaseRepository.GetAllAsync(isHiden);
            return _mapper.Map<List<TestCaseDto>>(testCases);
        }

        // --- GET TestCase by ID ---
        // ✅ Kiểu trả về mới: Task<TestCaseDto>
        public async Task<TestCaseDto> GetTestCaseByIdAsync(Guid testCaseId)
        {
            // Bỏ khối try-catch và ApiResponse<T>
            TestCase? testCase = await _TestCaseRepository.GetByIdAsync(testCaseId);

            // ✅ SỬA: Thay thế return new ApiResponse<TestCaseDto>(404, ...) bằng NotFoundException
            if (testCase == null)
            {
                throw new NotFoundException($"TestCase with ID {testCaseId} not found.");
            }

            return _mapper.Map<TestCaseDto>(testCase);
        }

        // --- UPDATE TestCase ---
        // ✅ Kiểu trả về mới: Task<TestCaseDto>
        public async Task<TestCaseDto> UpdateTestCaseAsync(UpdateTestCaseDto updateTestCaseDto)
        {
            // Bỏ khối try-catch và ApiResponse<T>

            // Mapping DTO sang Entity và cập nhật
            TestCase? testCase = await _TestCaseRepository.UpdateAsync(updateTestCaseDto);

            // ✅ SỬA: Thay thế return new ApiResponse<TestCaseDto>(404, ...) bằng NotFoundException
            if (testCase == null)
            {
                // Giả định UpdateTestCaseDto có trường ID
                throw new NotFoundException($"TestCase with ID {updateTestCaseDto.TestCaseId} not found for update.");
            }

            return _mapper.Map<TestCaseDto>(testCase);
        }
    }
}