using CodeForge.Api.DTOs.Request;
using CodeForge.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CodeForge.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _service;

        public ProfileController(IProfileService service)
        {
            _service = service;
        }

        [HttpGet("{profileId:guid}")]
        public async Task<IActionResult> GetById(Guid profileId)
        {
            var result = await _service.GetByIdAsync(profileId);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpGet("user/{userId:guid}")]
        public async Task<IActionResult> GetByUserId(Guid userId)
        {
            var result = await _service.GetByUserIdAsync(userId);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        [HttpPost]
        public async Task<IActionResult> Create(ProfileRequestDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return Ok(result);
        }

        [HttpPut("{profileId:guid}")]
        public async Task<IActionResult> Update(Guid profileId, ProfileRequestDto dto)
        {
            var result = await _service.UpdateAsync(profileId, dto);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpDelete("{profileId:guid}")]
        public async Task<IActionResult> Delete(Guid profileId)
        {
            var success = await _service.DeleteAsync(profileId);
            return success ? Ok() : NotFound();
        }
    }
}
