using CodeForge.Api.DTOs;
using CodeForge.Core.Interfaces.Services;
using CodeForge.Core.Service;
using Microsoft.AspNetCore.Mvc;

namespace CodeForge.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProblemController : ControllerBase
    {
        private readonly IProblemService _problemService;
        private readonly IJudge0Service _judge0Service;

        public ProblemController(IProblemService problemService , IJudge0Service judge0Service )
        {
            _problemService = problemService;
            _judge0Service = judge0Service;
        }


        // get all problem .
        [HttpGet]
        public async Task<IActionResult> GetAllProblemAsync()
        {
            var response = await _problemService.GetAllProblemAsync();

            return Ok(response);
        }

        // get problem by id .
        // [HttpGet("{problemId}")]
        // public async Task<IActionResult> GetProblemByIdAsync([FromRoute] Guid problemId)
        // {
        //     var response = await _problemService.GetProblemByIdAsync(problemId);

        //     return Ok(response);
        // }

        // get problem by id .
        [HttpGet("{slug}")]
        public async Task<IActionResult> GetProblemBySlugAsync([FromRoute] string slug)
        {
            var response = await _problemService.GetProblemBySlugAsync(slug);

            return Ok(response);
        }

        // update problem .
        [HttpPatch("update")]
        public async Task<IActionResult> UpdateProblemAsync([FromBody] UpdateProblemDto updateProblemDto)
        {
            var response = await _problemService.UpdateProblemAsync(updateProblemDto);

            return Ok(response);
        }

        // create problem .
        [HttpPost("create")]
        public async Task<IActionResult> CreateProblemAsync([FromBody] CreateProblemDto createProblemDto)
        {
            var response = await _problemService.CreateProblemAsync(createProblemDto);

            return Ok(response);
        }

        // delete problem 
        [HttpDelete("delete/{problemId}")]
        public async Task<IActionResult> DeleteProblemAsync([FromRoute] Guid problemId)
        {
            var response = await _problemService.DeleteProblemAsync(problemId);

            return Ok(response);
        }

        // run code 
        [HttpPost("run-problem")]
        public async Task<IActionResult> RunProblemAsync ([FromBody] RunProblemDto runProblemDto)
        {
            var response = await _judge0Service.RunAllTestCasesAsync(runProblemDto.Language, runProblemDto.Code, runProblemDto.FunctionName, runProblemDto.TestCases);
            return Ok(response);
        }
    }
}