using CodeForge.Api.DTOs;
using CodeForge.Api.DTOs.Request;
using CodeForge.Api.DTOs.Response;
using CodeForge.Core.Interfaces.Services;
using CodeForge.Core.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CodeForge.Api.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
     [Authorize]
    public class SubmissionsController : ControllerBase
    {
        private readonly ISubmissionService _submissionService;

        public SubmissionsController(ISubmissionService submissionService)
        {
            _submissionService = submissionService;
        }

        // get all .
        [HttpGet]
        public async Task<IActionResult> GetAllSubmissionAsync()
        {
            var result = await _submissionService.GetAllSubmissionAsync();

            return Ok(ApiResponse<List<SubmissionDto>>.Success(result, "Problems retrieved successfully."));
        }

        // get by problemId and userId .
        [HttpGet("{problemId}/{userId}")]
        public async Task<IActionResult> GetSubmissionByProblemIdAndUserId([FromRoute] Guid problemId, [FromRoute] Guid userId)
        {
            var result = await _submissionService.GetSubmissionByIdAsync(problemId, userId);

            return Ok(ApiResponse<List<SubmissionDto>>.Success(result, "Problems retrieved successfully"));
        }
        // create .
        [HttpPost("create")]
      
        public async Task<IActionResult> CreateSubmissionAsync([FromBody] CreateSubmissionDto createSubmissionDto)
        {
            // Service ném ConflictException nếu tiêu đề trùng
            var result = await _submissionService.CreateSubmissionAsync(createSubmissionDto);

            // Tránh lỗi định tuyến do không có endpoint GetById tương ứng cho CreatedAtAction
            return Ok(ApiResponse<SubmissionDto>.Created(result, "Submission created successfully."));

        }
    }
}