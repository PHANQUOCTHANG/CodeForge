using CodeForge.Api.DTOs.Request.Comment;
using CodeForge.Api.DTOs.Request.Thread;
using CodeForge.Api.DTOs.Response;
using CodeForge.Core.Entities;

public interface IThreadService
{
    Task<List<ThreadDto>> GetAllAsync();
    Task<IEnumerable<ThreadDto>> GetByUserAsync(Guid userId);

    Task<ThreadDto?> GetByIdAsync(Guid id);
    Task<ThreadDto> CreateAsync(CreateThreadDto dto);
    Task<bool> DeleteAsync(Guid id);
    Task<int> IncrementLikeAsync(Guid threadId);
    Task<int> DecrementLikeAsync(Guid threadId);
}
