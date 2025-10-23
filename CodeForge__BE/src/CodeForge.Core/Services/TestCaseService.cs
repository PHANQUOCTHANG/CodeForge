using AutoMapper;
using CodeForge.Api.DTOs;
using CodeForge.Api.DTOs.Response;
using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Core.Interfaces.Services;

namespace CodeForge.Core.Service
{
    public class TestCaseService : ITestCaseService
    {

        private readonly ITestCaseRepository _TestCaseRepository;
        private readonly IMapper _mapper;

        public TestCaseService(ITestCaseRepository TestCaseRepository, IMapper mapper)
        {
            _TestCaseRepository = TestCaseRepository;
            _mapper = mapper;
        }

        public async Task<ApiResponse<TestCaseDto>> CreateTestCaseAsync(CreateTestCaseDto createTestCaseDto)
        {
            try
            {
                TestCase testCase = await _TestCaseRepository.CreateAsync(createTestCaseDto);
                TestCaseDto TestCaseDto = _mapper.Map<TestCaseDto>(testCase);

                return new ApiResponse<TestCaseDto>(201, "Create TestCase success", TestCaseDto);
            }
            catch (Exception e)
            {
                return new ApiResponse<TestCaseDto>(500, e.Message);
            }
        }

        public async Task<ApiResponse<bool>> DeleteTestCaseAsync(Guid testCaseId)
        {
            try
            {
                bool result = await _TestCaseRepository.DeleteAsync(testCaseId);
                if (!result)
                {
                    return new ApiResponse<bool>(404, "Invalid");
                }
                return new ApiResponse<bool>(200, "Delete TestCase success");
            }
            catch (Exception e)
            {
                return new ApiResponse<bool>(500, e.Message);
            }
        }

        public async Task<ApiResponse<List<TestCaseDto>>> GetAllTestCaseAsync(bool? isHiden)
        {
            try
            {
                List<TestCase> testCases = await _TestCaseRepository.GetAllAsync(isHiden);
                List<TestCaseDto> testCaseDtos = _mapper.Map<List<TestCaseDto>>(testCases);

                return new ApiResponse<List<TestCaseDto>>(200, "Get all TestCase success", testCaseDtos);
            }
            catch (Exception e)
            {
                return new ApiResponse<List<TestCaseDto>>(500, e.Message);
            }
        }

        public async Task<ApiResponse<TestCaseDto>> GetTestCaseByIdAsync(Guid testCaseId)
        {
            try
            {
                TestCase? testCase = await _TestCaseRepository.GetByIdAsync(testCaseId);

                if (testCase == null)
                {
                    return new ApiResponse<TestCaseDto>(404, "Invalid");
                }

                TestCaseDto testCaseDto = _mapper.Map<TestCaseDto>(testCase);
                return new ApiResponse<TestCaseDto>(200, "Get all TestCase success", testCaseDto);
            }
            catch (Exception e)
            {
                return new ApiResponse<TestCaseDto>(500, e.Message);
            }
        }

        public async Task<ApiResponse<TestCaseDto>> UpdateTestCaseAsync(UpdateTestCaseDto updateTestCaseDto)
        {
            try
            {
                TestCase? testCase = await _TestCaseRepository.UpdateAsync(updateTestCaseDto);

                if (testCase == null)
                {
                    return new ApiResponse<TestCaseDto>(404, "Invalid TestCase need update");
                }

                TestCaseDto testCaseDto = _mapper.Map<TestCaseDto>(testCase);

                return new ApiResponse<TestCaseDto>(201, "Create TestCase success", testCaseDto);
            }
            catch (Exception e)
            {
                return new ApiResponse<TestCaseDto>(500, e.Message);
            }
        }
    }
}