using CodeForge.Api.DTOs;
using CodeForge.Core.Interfaces.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace CodeForge.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestCaseController : ControllerBase
    {
        private readonly ITestCaseService _testCaseService;

        public TestCaseController(ITestCaseService testCaseService)
        {
            _testCaseService = testCaseService;
        }


        // get all TestCase .
        [HttpGet]
        public async Task<IActionResult> GetAllTestCaseAsync([FromQuery] bool? isHiden)
        {
            var response = await _testCaseService.GetAllTestCaseAsync(isHiden);

            return Ok(response);
        }

        // get TestCase by id .
        [HttpGet("{TestCaseId}")]
        public async Task<IActionResult> GetTestCaseByIdAsync([FromRoute] Guid testCaseId)
        {
            var response = await _testCaseService.GetTestCaseByIdAsync(testCaseId);

            return Ok(response);
        }

        // update TestCase .
        [HttpPatch("update")]
        public async Task<IActionResult> UpdateTestCaseAsync([FromBody] UpdateTestCaseDto updateTestCaseDto)
        {
            var response = await _testCaseService.UpdateTestCaseAsync(updateTestCaseDto);

            return Ok(response);
        }

        // create TestCase .
        [HttpPost("create")]
        public async Task<IActionResult> CreateTestCaseAsync([FromBody] CreateTestCaseDto createTestCaseDto)
        {
            var response = await _testCaseService.CreateTestCaseAsync(createTestCaseDto);

            return Ok(response);
        }

        // delete TestCase 
        [HttpDelete("delete/{testCaseId}")]
        public async Task<IActionResult> DeleteTestCaseAsync([FromRoute] Guid testCaseId)
        {
            var response = await _testCaseService.DeleteTestCaseAsync(testCaseId);

            return Ok(response);
        }


    }
}