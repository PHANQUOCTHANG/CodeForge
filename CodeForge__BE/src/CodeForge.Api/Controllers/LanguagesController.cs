using CodeForge.Api.DTOs;
using CodeForge.Api.DTOs.Request.Language;
using CodeForge.Api.DTOs.Response; // Wrapper ApiResponse

using CodeForge.Core.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CodeForge.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LanguagesController : ControllerBase // hoặc BaseApiController
    {
        private readonly ILanguageService _languageService;

        public LanguagesController(ILanguageService languageService)
        {
            _languageService = languageService;
        }

        // GET: api/languages
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _languageService.GetAllLanguagesAsync();
            return Ok(ApiResponse<IEnumerable<LanguageDto>>.Success(result));
        }

        // GET: api/languages/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _languageService.GetLanguageByIdAsync(id);
            return Ok(ApiResponse<LanguageDto>.Success(result));
        }

        // POST: api/languages
        [HttpPost]
        [Authorize(Roles = "Admin")] // Chỉ Admin được thêm
        public async Task<IActionResult> Create([FromBody] CreateLanguageDto dto)
        {
            var result = await _languageService.CreateLanguageAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.LanguageID }, 
                ApiResponse<LanguageDto>.Created(result, "Tạo ngôn ngữ thành công"));
        }

        // PUT: api/languages/{id}
        [HttpPut("{id:guid}")]
        [Authorize(Roles = "Admin")] // Chỉ Admin được sửa
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateLanguageDto dto)
        {
            var result = await _languageService.UpdateLanguageAsync(id, dto);
            return Ok(ApiResponse<LanguageDto>.Success(result, "Cập nhật thành công"));
        }

        // DELETE: api/languages/{id}
        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Admin")] // Chỉ Admin được xóa
        public async Task<IActionResult> Delete(Guid id)
        {
            await _languageService.DeleteLanguageAsync(id);
            return Ok(ApiResponse<object>.Success(null, "Đã xóa ngôn ngữ thành công"));
        }
    }
}