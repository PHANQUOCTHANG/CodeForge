using CodeForge.Api.DTOs;
using CodeForge.Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using CodeForge.Api.DTOs.Response;

namespace CodeForge.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")] 
    public class TestCasesController : ControllerBase
    {
        private readonly ITestCaseService _testCaseService;

        public TestCasesController(ITestCaseService testCaseService)
        {
            _testCaseService = testCaseService;
        }


        // --- GET ALL TESTCASES (GET /api/testcase) ---
        [HttpGet]
        public async Task<IActionResult> GetAllTestCaseAsync()
        {
            // Service trả về List<TestCaseDto>
            var result = await _testCaseService.GetAllTestCaseAsync();

            return Ok(ApiResponse<List<TestCaseDto>>.Success(result, "Test cases retrieved successfully."));
        }

        // --- GET ALL TESTCASES (GET /api/testcase/problemId) ---
        [HttpGet("{problemId:guid}")]
        public async Task<IActionResult> GetAllTestCaseByProblemIdAsync([FromRoute] Guid problemId)
        {
            // Service trả về List<TestCaseDto>
            var result = await _testCaseService.GetAllTestCaseByProblemIdAsync(true , problemId);

            return Ok(ApiResponse<List<TestCaseDto>>.Success(result, "Test cases retrieved successfully."));
        }
        

        // --- GET TESTCASE BY ID (GET /api/testcase/{testCaseId}) ---
        [Authorize]
        [HttpGet("detail/{id:guid}")] 
        public async Task<IActionResult> GetTestCaseByIdAsync([FromRoute] Guid testCaseId)
        {
            // Service ném NotFoundException nếu không tìm thấy
            var result = await _testCaseService.GetTestCaseByIdAsync(testCaseId);

            return Ok(ApiResponse<TestCaseDto>.Success(result, "Test case retrieved successfully."));
        }

        // --- UPDATE TESTCASE (PATCH /api/testcase/update) ---
        [Authorize] 
        [HttpPatch] 
        public async Task<IActionResult> UpdateTestCaseAsync([FromBody] UpdateTestCaseDto updateTestCaseDto)
        {
            // Service ném NotFoundException/ConflictException
            var result = await _testCaseService.UpdateTestCaseAsync(updateTestCaseDto);

            return Ok(ApiResponse<TestCaseDto>.Success(result, "Test case updated successfully."));
        }

        // --- CREATE TESTCASE (POST /api/testcase) ---
        // [Authorize] 
        [HttpPost("create")] 
        public async Task<IActionResult> CreateTestCaseAsync([FromBody] CreateTestCaseDto createTestCaseDto)
        {
            // Service ném ConflictException nếu dữ liệu trùng lặp
            var result = await _testCaseService.CreateTestCaseAsync(createTestCaseDto);

            return CreatedAtAction(
                nameof(GetTestCaseByIdAsync),
                new { testCaseId = result.TestCaseId }, 
                ApiResponse<TestCaseDto>.Created(result, "Test case created successfully.")
            );
        }

        // --- DELETE TESTCASE (DELETE /api/testcase/{testCaseId}) ---
        [Authorize]
        [HttpDelete("{id:guid}")] 
        public async Task<IActionResult> DeleteTestCaseAsync([FromRoute] Guid testCaseId)
        {
            // Service ném NotFoundException nếu không tìm thấy
            await _testCaseService.DeleteTestCaseAsync(testCaseId);

            return NoContent();
        }
    }
}