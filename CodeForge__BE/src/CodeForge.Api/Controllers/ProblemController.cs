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
    public class ProblemsController : ControllerBase
    {
        private readonly IProblemService _problemService;
        private readonly IJudge0Service _judge0Service;

        public ProblemsController(IProblemService problemService, IJudge0Service judge0Service)
        {
            _problemService = problemService;
            _judge0Service = judge0Service;
        }

        // --- GET ALL PROBLEMS (GET /api/problem) ---
        [HttpGet]
        // ✅ Công khai (Không cần token)
        public async Task<IActionResult> GetAllProblemAsync()
        {
            // Service trả về List<ProblemDto>
            var result = await _problemService.GetAllProblemAsync();

            // ✅ Bọc dữ liệu và trả về 200 OK
            return Ok(ApiResponse<List<ProblemDto>>.Success(result, "Problems retrieved successfully."));
        }

        // --- GET PROBLEM BY SLUG (GET /api/problem/{slug}) ---
        [HttpGet("{slug}")]
        // ✅ Công khai (Không cần token)
        public async Task<IActionResult> GetProblemBySlugAsync([FromRoute] string slug)
        {
            // Service ném NotFoundException nếu không tìm thấy
            var result = await _problemService.GetProblemBySlugAsync(slug);

            // ✅ Bọc dữ liệu và trả về 200 OK
            return Ok(ApiResponse<ProblemDto>.Success(result, "Problem retrieved successfully."));
        }

        // --- UPDATE PROBLEM (PATCH /api/problem/update) ---
        [Authorize] // 🛡️ Yêu cầu Access Token
        [HttpPatch("update")]
        public async Task<IActionResult> UpdateProblemAsync([FromBody] UpdateProblemDto updateProblemDto)
        {
            // Service ném NotFoundException/ConflictException
            var result = await _problemService.UpdateProblemAsync(updateProblemDto);

            // ✅ Trả về 200 OK
            return Ok(ApiResponse<ProblemDto>.Success(result, "Problem updated successfully."));
        }

        // --- CREATE PROBLEM (POST /api/problem/create) ---
        [Authorize] // 🛡️ Yêu cầu Access Token
        [HttpPost("create")]
        public async Task<IActionResult> CreateProblemAsync([FromBody] CreateProblemDto createProblemDto)
        {
            // Service ném ConflictException nếu tiêu đề trùng
            var result = await _problemService.CreateProblemAsync(createProblemDto);

            // ✅ Chuẩn RESTful: Trả về 201 Created
            return CreatedAtAction(
                nameof(GetProblemBySlugAsync),
                new { slug = result.Slug }, // Giả định ProblemDto có Slug
                ApiResponse<ProblemDto>.Created(result, "Problem created successfully.")
            );
        }

        // --- DELETE PROBLEM (DELETE /api/problem/{problemId}) ---
        [Authorize] // 🛡️ Yêu cầu Access Token
        [HttpDelete("{id:guid}")] // ✅ Đã sửa route thành RESTful
        public async Task<IActionResult> DeleteProblemAsync([FromRoute] Guid problemId)
        {
            // Service ném NotFoundException nếu không tìm thấy
            await _problemService.DeleteProblemAsync(problemId);

            // ✅ Chuẩn RESTful: Trả về 204 No Content
            return NoContent();
        }

        // --- RUN CODE (POST /api/problem/run-problem) ---
        [HttpPost("run-problem")]
        // ✅ Công khai (Chạy code không cần đăng nhập) HOẶC [Authorize] nếu bạn muốn hạn chế
        public async Task<IActionResult> RunProblemAsync([FromBody] RunProblemDto runProblemDto)
        {
            // Giả định RunProblemDto chứa đủ thông tin cho Judge0
            // Giả định service trả về đối tượng kết quả (ví dụ: SubmissionResultDto)
            var result = await _judge0Service.RunAllTestCasesAsync(
                runProblemDto.Language,
                runProblemDto.Code,
                runProblemDto.FunctionName,
                runProblemDto.TestCases
            );

            // Trả về 200 OK với kết quả biên dịch/chạy
            return Ok(ApiResponse<object>.Success(result, "Code executed successfully."));
        }
    }
}