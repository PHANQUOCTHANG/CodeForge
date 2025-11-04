using CodeForge.Api.DTOs;
using CodeForge.Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

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

        public async Task<IActionResult> GetAllProblemAsync()
        {
            // Service trả về List<ProblemDto>
            var result = await _problemService.GetAllProblemAsync();


            return Ok(ApiResponse<List<ProblemDto>>.Success(result, "Problems retrieved successfully."));
        }

        // --- GET PROBLEM BY SLUG (GET /api/problem/{slug}) ---
        [HttpGet("{slug}")]

        public async Task<IActionResult> GetProblemBySlugAsync([FromRoute] string slug)
        {
            // Service ném NotFoundException nếu không tìm thấy
            var result = await _problemService.GetProblemBySlugAsync(slug);


            return Ok(ApiResponse<ProblemDto>.Success(result, "Problem retrieved successfully."));
        }

        // --- UPDATE PROBLEM (PATCH /api/problem/update) ---
        // [Authorize] 
        [HttpPatch("update/{id}")]
        public async Task<IActionResult> UpdateProblemAsync([FromBody] UpdateProblemDto updateProblemDto, [FromRoute] Guid id)
        {
            // Service ném NotFoundException/ConflictException
            var result = await _problemService.UpdateProblemAsync(updateProblemDto);

            return Ok(ApiResponse<ProblemDto>.Success(result, "Problem updated successfully."));
        }

        // --- CREATE PROBLEM (POST /api/problem/create) ---
        [HttpPost("create")]
        public async Task<IActionResult> CreateProblemAsync([FromBody] CreateProblemDto createProblemDto)
        {
            // Service ném ConflictException nếu tiêu đề trùng
            var result = await _problemService.CreateProblemAsync(createProblemDto);

            return CreatedAtAction(
                nameof(GetProblemBySlugAsync),
                new { slug = result.Slug },
                ApiResponse<ProblemDto>.Created(result, "Problem created successfully.")
            );
        }

        // --- DELETE PROBLEM (DELETE /api/problem/{problemId}) ---
        [Authorize]
        [HttpDelete("{problemId:guid}")]
        public async Task<IActionResult> DeleteProblemAsync([FromRoute] Guid problemId)
        {
            await _problemService.DeleteProblemAsync(problemId);

            return NoContent();
        }

        // --- RUN CODE (POST /api/problem/run-problem) ---
        [HttpPost("run-problem")]
        public async Task<IActionResult> RunProblemAsync([FromBody] RunProblemDto runProblemDto)
        {
            if (runProblemDto == null)
            {
                return BadRequest(ApiResponse<object>.Fail("Invalid request body."));
            }

            var language = string.IsNullOrWhiteSpace(runProblemDto.Language) ? "cpp" : runProblemDto.Language;
            var code = runProblemDto.Code ?? string.Empty;
            var functionName = runProblemDto.FunctionName ?? string.Empty;
            var testCases = runProblemDto.TestCases ?? [];

            var result = await _judge0Service.RunAllTestCasesAsync(
                language,
                code,
                functionName,
                testCases,
                runProblemDto.ProblemId
            );

            return Ok(ApiResponse<object>.Success(result, "Code executed successfully."));
        }

        [HttpPost("submit")]
        public async Task<IActionResult> SubmitProblemAsync([FromBody] RunProblemDto runProblemDto)
        {
            if (runProblemDto == null)
            {
                return BadRequest(ApiResponse<object>.Fail("Invalid request body."));
            }

            var language = string.IsNullOrWhiteSpace(runProblemDto.Language) ? "cpp" : runProblemDto.Language;
            var code = runProblemDto.Code ?? string.Empty;
            var functionName = runProblemDto.FunctionName ?? string.Empty;

            var result = await _judge0Service.SubmitProblem(
                runProblemDto.UserId,
                runProblemDto.ProblemId,
                language,
                code,
                functionName
            );

            return Ok(ApiResponse<object>.Success(result, "Code executed successfully."));
        }
    }
}