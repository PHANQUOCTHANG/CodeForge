using CodeForge.Api.DTOs;
using CodeForge.Core.Entities;

namespace CodeForge.Core.Interfaces.Services
{
    public interface IProblemService
    {
        Task<ApiResponse<List<ProblemDto>>> GetAllProblemAsync();
        Task<ApiResponse<ProblemDto>> GetProblemByIdAsync(Guid problemId);

        Task<ApiResponse<ProblemDto>> GetProblemBySlugAsync(string slug);

        Task<ApiResponse<ProblemDto>> UpdateProblemAsync(UpdateProblemDto updateProblemDto);
        Task<ApiResponse<ProblemDto>> CreateProblemAsync(CreateProblemDto createProblemDto);
        Task<ApiResponse<bool>> DeleteProblemAsync(Guid problemId);
    }
}