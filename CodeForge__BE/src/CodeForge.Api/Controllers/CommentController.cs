// using AutoMapper;
// using CodeForge.Api.DTOs.Request.Comment;
// using CodeForge.Api.DTOs.Response;
// using CodeForge.Core.Entities;
// using CodeForge.Core.Interfaces;
// using Microsoft.AspNetCore.Mvc;

// namespace CodeForge.Api.Controllers
// {
//     [Route("api/[controller]")]
//     [ApiController]
//     public class CommentController : ControllerBase
//     {
//         private readonly ICommentService _service;
//         private readonly IMapper _mapper;

//         public CommentController(ICommentService service, IMapper mapper)
//         {
//             _service = service;
//             _mapper = mapper;
//         }

//         [HttpGet("thread/{threadId}")]
//         public async Task<IActionResult> GetByThread(Guid threadId)
//         {
//             var comments = await _service.GetByThreadIdAsync(threadId);
//             return Ok(_mapper.Map<IEnumerable<CommentDto>>(comments));
//         }

        

//         [HttpPost]
//         public async Task<IActionResult> Create(CreateCommentDto dto)
//         {
//             var comment = _mapper.Map<Comment>(dto);
//             var result = await _service.CreateAsync(dto);
//             return Ok(_mapper.Map<CommentDto>(result));
//         }

        

//         [HttpDelete("{id}")]
//         public async Task<IActionResult> Delete(Guid commentId, Guid userId)
//         {
//             var success = await _service.DeleteAsync(commentId, userId);
//             return Ok(new { message = "Deleted" });
//         }
//     }
// }
