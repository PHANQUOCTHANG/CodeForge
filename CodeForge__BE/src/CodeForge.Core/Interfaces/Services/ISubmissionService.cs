
using CodeForge.Api.DTOs.Request;
using CodeForge.Api.DTOs.Response;
using CodeForge.Core.Entities;

namespace CodeForge.Core.Interfaces.Services
{
    public interface ISubmissionService
    {
        Task<List<SubmissionDto>> GetAllSubmissionAsync();
        Task<List<SubmissionDto>> GetSubmissionByIdAsync(Guid problemId , Guid userId);
        Task<SubmissionDto> CreateSubmissionAsync(CreateSubmissionDto createSubmissionDto);
    }
}