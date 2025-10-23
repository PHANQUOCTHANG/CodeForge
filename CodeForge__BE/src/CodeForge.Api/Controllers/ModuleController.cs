using CodeForge.Api.DTOs;
using CodeForge.Core.Interfaces.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace CodeForge.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ModuleController : ControllerBase
    {
        private readonly IModuleService _moduleService;

        public ModuleController(IModuleService moduleService)
        {
            _moduleService = moduleService;
        }


        // get all module .
        [HttpGet]
        public async Task<IActionResult> GetAllModuleAsync()
        {
            var response = await _moduleService.GetAllModuleAsync();

            return Ok(response);
        }

        // get module by id .
        [HttpGet("{moduleId}")]
        public async Task<IActionResult> GetModuleByIdAsync([FromRoute] Guid moduleId)
        {
            var response = await _moduleService.GetModuleByIdAsync(moduleId);

            return Ok(response);
        }

        // update module .
        [HttpPatch("update")]
        public async Task<IActionResult> UpdateModuleAsync([FromBody] UpdateModuleDto updateModuleDto)
        {
            var response = await _moduleService.UpdateModuleAsync(updateModuleDto);

            return Ok(response);
        }

        // create module .
        [HttpPost("create")]
        public async Task<IActionResult> CreateModuleAsync([FromBody] CreateModuleDto createModuleDto)
        {
            var response = await _moduleService.CreateModuleAsync(createModuleDto);

            return Ok(response);
        }

        // delete module 
        [HttpDelete("delete/{moduleId}")]
        public async Task<IActionResult> DeleteModuleAsync([FromRoute] Guid moduleId)
        {
            var response = await _moduleService.DeleteModuleAsync(moduleId);

            return Ok(response);
        }


    }
}