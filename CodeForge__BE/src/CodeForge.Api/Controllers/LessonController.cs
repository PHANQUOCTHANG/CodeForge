using CodeForge.Api.DTOs;
using CodeForge.Core.Interfaces.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace CodeForge.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LessonController : ControllerBase
    {
        private readonly ILessonService _lessonService;

        public LessonController(ILessonService lessonService)
        {
            _lessonService = lessonService;
        }


        // get all lesson .
        [HttpGet]
        public async Task<IActionResult> GetAllLessonAsync()
        {
            var response = await _lessonService.GetAllLessonAsync();

            return Ok(response);
        }

        // get lesson by id .
        [HttpGet("{lessonId}")]
        public async Task<IActionResult> GetLessonByIdAsync([FromRoute] Guid lessonId)
        {
            var response = await _lessonService.GetLessonByIdAsync(lessonId);

            return Ok(response);
        }

        // update lesson .
        [HttpPatch("update")]
        public async Task<IActionResult> UpdateLessonAsync([FromBody] UpdateLessonDto updateLessonDto)
        {
            var response = await _lessonService.UpdateLessonAsync(updateLessonDto);

            return Ok(response);
        }

        // create lesson .
        [HttpPost("create")]
        public async Task<IActionResult> CreateLessonAsync([FromBody] CreateLessonDto createLessonDto)
        {
            var response = await _lessonService.CreateLessonAsync(createLessonDto);

            return Ok(response);
        }

        // delete lesson 
        [HttpDelete("delete/{lessonId}")]
        public async Task<IActionResult> DeleteLessonAsync([FromRoute] Guid lessonId)
        {
            var response = await _lessonService.DeleteLessonAsync(lessonId);

            return Ok(response);
        }


    }
}