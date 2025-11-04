
using CodeForge.Api.DTOs.Request;
using CodeForge.Core.Entities;

namespace CodeForge.Core.Interfaces.Repositories
{
    public interface ISubmissionRepository
    {
        Task<List<Submission>> GetAllAsync();
        Task<List<Submission>> GetByIdAsync(Guid problemId , Guid userId);
        Task<Submission> CreateAsync(CreateSubmissionDto createSubmissionDto);
    }
}