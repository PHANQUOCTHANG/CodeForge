using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CodeForge__BE.src.CodeForge.Api.DTOs.Request.Course;
using CodeForge__BE.src.CodeForge.Api.DTOs.Response;
using CodeForge__BE.src.CodeForge.Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace CodeForge__BE.src.CodeForge.Api.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class CourseController : ControllerBase
    {
        private readonly ICourseService _service;
        public CourseController(ICourseService _service)
        {
            this._service = _service;
        }
        //[GET] api/courses
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var courses = await _service.GetAllAsync();
            return Ok(new ApiResponse<IEnumerable<CourseDto>>(200, "Course retrieved successfully", courses));
        }
        // GET api/courses/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var course = await _service.GetByIdAsync(id);
                if (course == null)
                {
                    return NotFound(new ApiResponse<string>(404, "Course not found"));
                }

                return Ok(new ApiResponse<CourseDto>(200, "Success", course));
            }
            catch (Exception ex)
            {
                // log lỗi nếu cần
                return StatusCode(500, new ApiResponse<string>(500, $"Internal Server Error: {ex.Message}"));
            }
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] createCourseDto _createCourseDto)
        {
            var created = await _service.CreateAsync(_createCourseDto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = created.CourseId }, // đúng với DTO
                new ApiResponse<CourseDto>(201, "Course created successfully", created)
            );
        }


        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] updateCourseDto _updateCourseDto)
        {
            try
            {
                var updated = await _service.UpdateAsync(id, _updateCourseDto);

                if (updated == null)
                {
                    return NotFound(new ApiResponse<string>(404, "Course not found"));
                }

                return Ok(new ApiResponse<CourseDto>(200, "Course updated successfully", updated));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, $"Internal Server Error: {ex.Message}"));
            }
        }
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                var deleted = await _service.DeleteAsync(id);

                if (!deleted)
                {
                    return NotFound(new ApiResponse<string>(404, "Course not found"));
                }

                return Ok(new ApiResponse<string>(200, "Course deleted successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<string>(500, $"Internal Server Error: {ex.Message}"));
            }
        }



    }
}