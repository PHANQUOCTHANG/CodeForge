using CodeForge.Api.DTOs;
using CodeForge.Core.Entities;

namespace CodeForge.Core.Interfaces.Repositories
{
    public interface IProblemRepository
    {
        Task<List<Problem>> GetAllAsync();
        Task<Problem?> GetByIdAsync(Guid problemId);

        Task<Problem?> UpdateAsync(UpdateProblemDto updateProblemDto);
        Task<Problem> CreateAsync(CreateProblemDto createProblemDto);

        Task<bool> DeleteAsync(Guid problemId);

        Task<bool> ExistsByTitle(string title);
    }
}