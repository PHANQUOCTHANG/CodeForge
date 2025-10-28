using CodeForge.Api.DTOs;
using CodeForge.Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using CodeForge.Api.DTOs.Response; // Giả định TestCase DTOs nằm ở đây

namespace CodeForge.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Route: api/testcase
    public class TestCasesController : ControllerBase
    {
        private readonly ITestCaseService _testCaseService;

        public TestCasesController(ITestCaseService testCaseService)
        {
            _testCaseService = testCaseService;
        }


        // --- GET ALL TESTCASES (GET /api/testcase) ---
        // ✅ Endpoint công khai hoặc được bảo vệ nhẹ (tuỳ theo nghiệp vụ)
        [HttpGet]
        public async Task<IActionResult> GetAllTestCaseAsync([FromQuery] bool? isHiden)
        {
            // Service trả về List<TestCaseDto>
            var result = await _testCaseService.GetAllTestCaseAsync(isHiden);

            // ✅ Bọc dữ liệu và trả về 200 OK
            return Ok(ApiResponse<List<TestCaseDto>>.Success(result, "Test cases retrieved successfully."));
        }

        // --- GET TESTCASE BY ID (GET /api/testcase/{testCaseId}) ---
        // ✅ Thường chỉ dùng cho mục đích admin, nên bảo vệ.
        [Authorize]
        [HttpGet("{id:guid}")] // ✅ Thêm Route Constraint
        public async Task<IActionResult> GetTestCaseByIdAsync([FromRoute] Guid testCaseId)
        {
            // Service ném NotFoundException nếu không tìm thấy
            var result = await _testCaseService.GetTestCaseByIdAsync(testCaseId);

            // ✅ Bọc dữ liệu và trả về 200 OK
            return Ok(ApiResponse<TestCaseDto>.Success(result, "Test case retrieved successfully."));
        }

        // --- UPDATE TESTCASE (PATCH /api/testcase/update) ---
        [Authorize] // 🛡️ Yêu cầu Access Token
        [HttpPatch] // ✅ Thay 'update' bằng endpoint gốc
        public async Task<IActionResult> UpdateTestCaseAsync([FromBody] UpdateTestCaseDto updateTestCaseDto)
        {
            // Service ném NotFoundException/ConflictException
            var result = await _testCaseService.UpdateTestCaseAsync(updateTestCaseDto);

            // ✅ Trả về 200 OK (Standard for update)
            return Ok(ApiResponse<TestCaseDto>.Success(result, "Test case updated successfully."));
        }

        // --- CREATE TESTCASE (POST /api/testcase) ---
        [Authorize] // 🛡️ Yêu cầu Access Token
        [HttpPost] // ✅ Thay 'create' bằng endpoint gốc
        public async Task<IActionResult> CreateTestCaseAsync([FromBody] CreateTestCaseDto createTestCaseDto)
        {
            // Service ném ConflictException nếu dữ liệu trùng lặp
            var result = await _testCaseService.CreateTestCaseAsync(createTestCaseDto);

            // ✅ Chuẩn RESTful: Dùng CreatedAtAction để trả về 201 Created
            return CreatedAtAction(
                nameof(GetTestCaseByIdAsync),
                new { testCaseId = result.TestCaseId }, // Giả định TestCaseDto có Id
                ApiResponse<TestCaseDto>.Created(result, "Test case created successfully.")
            );
        }

        // --- DELETE TESTCASE (DELETE /api/testcase/{testCaseId}) ---
        [Authorize] // 🛡️ Yêu cầu Access Token
        [HttpDelete("{id:guid}")] // ✅ Đã sửa route thành RESTful
        public async Task<IActionResult> DeleteTestCaseAsync([FromRoute] Guid testCaseId)
        {
            // Service ném NotFoundException nếu không tìm thấy
            await _testCaseService.DeleteTestCaseAsync(testCaseId);

            // ✅ Chuẩn RESTful: Dùng NoContent để trả về 204 No Content
            return NoContent();
        }
    }
}