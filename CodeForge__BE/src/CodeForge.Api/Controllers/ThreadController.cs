using CodeForge.Api.DTOs.Request.Comment;
using CodeForge.Api.DTOs.Request.Thread;
using CodeForge.Api.DTOs.Response;
using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Services;
using CodeForge.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;

namespace CodeForge.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThreadController : ControllerBase
    {
        private readonly IThreadService _service;

        public ThreadController(IThreadService service)
        {
            _service = service;
        }

        /// <summary>
        /// Lấy tất cả threads
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var threads = await _service.GetAllAsync();
            return Ok(threads);
        }

        /// <summary>
        /// Lấy thread theo ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var thread = await _service.GetByIdAsync(id);
            if (thread == null) 
                return NotFound(new { message = "Thread not found" });
            
            return Ok(thread);
        }

        /// <summary>
        /// Tạo thread mới
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateThreadDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(
                nameof(GetById), 
                new { id = created.ThreadID }, 
                created
            );
        }

        /// <summary>
        /// Xóa thread (soft delete)
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var success = await _service.DeleteAsync(id);
            if (!success) 
                return NotFound(new { message = "Thread not found" });
            
            return Ok(new { message = "Thread deleted successfully" });
        }
        [HttpPost("{threadId}/like")]
        public async Task<IActionResult> ToggleLike(Guid threadId, [FromBody] LikeToggleDto dto)
        {
            try
            {
                int newLikeCount;

                if (dto.IsLike)
                {
                    newLikeCount = await _service.IncrementLikeAsync(threadId);
                }
                else
                {
                    newLikeCount = await _service.DecrementLikeAsync(threadId);
                }

                return Ok(new
                {
                    likeCount = newLikeCount,
                    message = dto.IsLike ? "Liked" : "Unliked"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        public class LikeToggleDto
        {
            public bool IsLike { get; set; }
        }
    }
}
