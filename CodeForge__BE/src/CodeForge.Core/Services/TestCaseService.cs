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
        public async Task<TestCaseDto> CreateTestCaseAsync(CreateTestCaseDto createTestCaseDto)
        {
            TestCase testCase = await _TestCaseRepository.CreateAsync(createTestCaseDto);

            return _mapper.Map<TestCaseDto>(testCase);
        }

        // --- DELETE TestCase ---
        public async Task<bool> DeleteTestCaseAsync(Guid testCaseId)
        {
            bool result = await _TestCaseRepository.DeleteAsync(testCaseId);

            if (!result)
            {
                throw new NotFoundException($"TestCase with ID {testCaseId} not found.");
            }

            return true;
        }

        // --- GET All TestCase ---
        public async Task<List<TestCaseDto>> GetAllTestCaseAsync()
        {
            List<TestCase> testCases = await _TestCaseRepository.GetAllAsync();
            return _mapper.Map<List<TestCaseDto>>(testCases);
        }

        public async Task<List<TestCaseDto>> GetAllTestCaseByProblemIdAsync(bool? isHidden, Guid problemId)
        {
            List<TestCase> testCases = await _TestCaseRepository.GetAllByProblemIdAsync(isHidden , problemId);
            return _mapper.Map<List<TestCaseDto>>(testCases);
        }

        // --- GET TestCase by ID ---
        public async Task<TestCaseDto> GetTestCaseByIdAsync(Guid testCaseId)
        {
            // Bỏ khối try-catch và ApiResponse<T>
            TestCase? testCase = await _TestCaseRepository.GetByIdAsync(testCaseId);

            if (testCase == null)
            {
                throw new NotFoundException($"TestCase with ID {testCaseId} not found.");
            }

            return _mapper.Map<TestCaseDto>(testCase);
        }

        // --- UPDATE TestCase ---
        public async Task<TestCaseDto> UpdateTestCaseAsync(UpdateTestCaseDto updateTestCaseDto)
        {
            // Mapping DTO sang Entity và cập nhật
            TestCase? testCase = await _TestCaseRepository.UpdateAsync(updateTestCaseDto);

            if (testCase == null)
            {
                // Giả định UpdateTestCaseDto có trường ID
                throw new NotFoundException($"TestCase with ID {updateTestCaseDto.TestCaseId} not found for update.");
            }

            return _mapper.Map<TestCaseDto>(testCase);
        }
    }
}