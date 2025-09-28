using CodeForge.Api.DTOs;
using CodeForge.Core.Interfaces.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace CodeForge.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProblemController : ControllerBase
    {
        private readonly IProblemService _problemService;

        public ProblemController(IProblemService problemService)
        {
            _problemService = problemService;
        }


        // get all problem .
        [HttpGet]
        public async Task<IActionResult> GetAllProblemAsync()
        {
            var response = await _problemService.GetAllProblemAsync();

            return Ok(response);
        }

        // get problem by id .
        [HttpGet("{problemId}")]
        public async Task<IActionResult> GetProblemByIdAsync([FromRoute] Guid problemId)
        {
            var response = await _problemService.GetProblemByIdAsync(problemId);

            return Ok(response);
        }

        // update problem .
        [HttpPatch]
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
        [HttpDelete("{problemId}")]
        public async Task<IActionResult> DeleteProblemAsync([FromRoute] Guid problemId)
        {
            var response = await _problemService.DeleteProblemAsync(problemId);

            return Ok(response);
        }


    }
}