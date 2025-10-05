using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CodeForge.Api.DTOs.Request.Course;
using CodeForge__BE.src.CodeForge.Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace CodeForge__BE.src.CodeForge.Api.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class CourseController : ControllerBase
    {
        private readonly ICourseService _courseService;

        public CourseController(ICourseService courseService)
        {
            _courseService = courseService;
        }


        // get all Course .
        [HttpGet]
        public async Task<IActionResult> GetAllCourseAsync([FromQuery] QueryParameters query)
        {
            var response = await _courseService.GetAllCourseAsync(query);

            return Ok(response);
        }

        // get Course by id .
        [HttpGet("{courseId}")]
        public async Task<IActionResult> GetCourseByIdAsync([FromRoute] Guid courseId)
        {
            var response = await _courseService.GetCourseByIdAsync(courseId);

            return Ok(response);
        }

        // update Course .
        [HttpPatch("update")]
        public async Task<IActionResult> UpdateCourseAsync([FromBody] UpdateCourseDto updateCourseDto)
        {
            var response = await _courseService.UpdateCourseAsync(updateCourseDto);

            return Ok(response);
        }

        // create Course .
        [HttpPost("create")]
        public async Task<IActionResult> CreateCourseAsync([FromBody] CreateCourseDto createCourseDto)
        {
            var response = await _courseService.CreateCourseAsync(createCourseDto);

            return Ok(response);
        }

        // delete Course 
        [HttpDelete("delete/{courseId}")]
        public async Task<IActionResult> DeleteCourseAsync([FromRoute] Guid courseId)
        {
            var response = await _courseService.DeleteCourseAsync(courseId);

            return Ok(response);
        }



    }
}