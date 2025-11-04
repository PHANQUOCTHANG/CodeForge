using CodeForge.Api.DTOs;
using CodeForge.Api.DTOs.Response;
using CodeForge.Core.Entities;

namespace CodeForge.Core.Interfaces.Services
{
        public interface IProblemService
        {
                Task<List<ProblemDto>> GetAllProblemAsync();
                Task<ProblemDto> GetProblemByIdAsync(Guid problemId);

                Task<ProblemDto> GetProblemBySlugAsync(string slug);

                Task<ProblemDto> UpdateProblemAsync(UpdateProblemDto updateProblemDto);
                Task<ProblemDto> CreateProblemAsync(CreateProblemDto createProblemDto);
                Task<bool> DeleteProblemAsync(Guid problemId);
        }
}