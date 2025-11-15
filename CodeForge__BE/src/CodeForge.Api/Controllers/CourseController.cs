using CodeForge.Api.Controllers;
using CodeForge.Api.DTOs;
using CodeForge.Api.DTOs.Request.Course;
using CodeForge.Api.DTOs.Response;
using CodeForge.Application.DTOs.Response;
using CodeForge.Core.Interfaces.Services;
using CodeForge__BE.src.CodeForge.Core.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace CodeForge__BE.src.CodeForge.Api.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class CoursesController : BaseApiController
    {
        private readonly ICourseService _courseService;

        public CoursesController(ICourseService courseService)
        {
            _courseService = courseService;
        }

        // --- GET ALL COURSES PAGED (GET /api/course/paged) ---
        [HttpGet("paged")]
        // ✅ Public endpoint - No Authorize attribute needed
        public async Task<IActionResult> GetCoursePagedAsync([FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null, [FromQuery] string? level = null)
        {
            var userId = GetUserId();
            // Service returns PaginationResult<object> (assuming this handles success structure internally)
            var result = await _courseService.GetPagedCoursesAsync(userId, page, pageSize, search, level);

            // If PaginationResult is your success wrapper, just return Ok(result).
            // If not, you should wrap it:
            return Ok(result);
        }

        // --- GET DETAIL BY SLUG (GET /api/course/slug/{slug}) ---
        [HttpGet("slug/{slug}")]
        // ✅ Public endpoint - No Authorize attribute needed
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var userId = GetUserId();
            var result = await _courseService.GetCourseDetailBySlugAsync(slug, userId);

            // ✅ IMPROVEMENT: Check for null and return 404 (NotFoundException should be thrown in service, 
            // but checking for null here is okay if the service returns null instead of throwing 404)
            if (result == null)
            {
                // Note: If GetCourseDetailBySlugAsync was designed to throw NotFoundException,
                // you would remove this block completely. For null checks, this is fine.
                return NotFound(ApiResponse<string>.Fail("Course not found."));
            }

            // ✅ Wrap and return 200 OK
            return Ok(ApiResponse<CourseDetailDto>.Success(result, "Course detail retrieved."));
        }

        // --- GET COURSE BY ID (GET /api/course/{courseId}) ---
        [HttpGet("{id:guid}")]
        // ✅ Public endpoint - No Authorize attribute needed (Assuming course view is public)
        public async Task<IActionResult> GetCourseByIdAsync([FromRoute] Guid courseId)
        {
            // Service throws NotFoundException if not found.
            var result = await _courseService.GetCourseByIdAsync(courseId);

            // ✅ Wrap and return 200 OK
            return Ok(ApiResponse<CourseDto>.Success(result, "Course retrieved successfully."));
        }

        // --- UPDATE COURSE (PATCH /api/course/update) ---
        [Authorize] // 🛡️ Requires Access Token
        [HttpPatch("update")]
        public async Task<IActionResult> UpdateCourseAsync([FromBody] UpdateCourseDto updateCourseDto)
        {
            // Service throws NotFoundException/ConflictException.
            var result = await _courseService.UpdateCourseAsync(updateCourseDto);

            // ✅ Return 200 OK (Standard for successful update)
            return Ok(ApiResponse<CourseDto>.Success(result, "Course updated successfully."));
        }

        // --- CREATE COURSE (POST /api/course/create) ---
        [Authorize] // 🛡️ Requires Access Token
        [HttpPost("create")]
        public async Task<IActionResult> CreateCourseAsync([FromBody] CreateCourseDto createCourseDto)
        {
            // Service throws ConflictException if title exists.
            var result = await _courseService.CreateCourseAsync(createCourseDto);

            // ✅ RESTful: Return 201 Created
            return CreatedAtAction(
                nameof(GetCourseByIdAsync),
                new { courseId = result.CourseId }, // Assumes CourseDto has an Id property
                ApiResponse<CourseDto>.Created(result, "Course created successfully.")
            );
        }

        // --- DELETE COURSE (DELETE /api/course/delete/{courseId}) ---
        [Authorize] // 🛡️ Requires Access Token
        [HttpDelete("{id:guid}")] // ✅ Use route constraint and clean up route
        public async Task<IActionResult> DeleteCourseAsync([FromRoute] Guid courseId)
        {
            // Service throws NotFoundException if not found.
            await _courseService.DeleteCourseAsync(courseId);

            // ✅ RESTful: Return 204 No Content
            return NoContent();
        }
    }
}