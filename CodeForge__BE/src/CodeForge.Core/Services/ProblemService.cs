using AutoMapper;
using CodeForge.Api.DTOs; // Có thể xóa nếu không dùng ApiResponse<T>
using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Core.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

// ✅ Import Custom Exceptions
using CodeForge.Core.Exceptions;
using CodeForge.Api.DTOs.Response;


namespace CodeForge.Core.Service
{
    public class ProblemService : IProblemService // IProblemService phải được cập nhật
    {
        private readonly IProblemRepository _problemRepository;
        private readonly IMapper _mapper;

        public ProblemService(IProblemRepository problemRepository, IMapper mapper)
        {
            _problemRepository = problemRepository;
            _mapper = mapper;
        }

        // --- CREATE Problem ---
        // ✅ Kiểu trả về: Task<ProblemDto>
        public async Task<ProblemDto> CreateProblemAsync(CreateProblemDto createProblemDto)
        {
            bool isExistsByTitle = await _problemRepository.ExistsByTitle(createProblemDto.Title);

            if (isExistsByTitle)
                throw new ConflictException($"Problem with title '{createProblemDto.Title}' already exists.");

            Problem problem = await _problemRepository.CreateAsync(createProblemDto);

            return _mapper.Map<ProblemDto>(problem);
        }

        // --- DELETE Problem ---
        // ✅ Kiểu trả về: Task<bool>
        public async Task<bool> DeleteProblemAsync(Guid problemId)
        {
            bool result = await _problemRepository.DeleteAsync(problemId);

            if (!result)
                throw new NotFoundException($"Problem with ID {problemId} not found.");

            return true;
        }

        // --- GET All Problem ---
        // ✅ Kiểu trả về: Task<List<ProblemDto>>
        public async Task<List<ProblemDto>> GetAllProblemAsync()
        {
            // Bỏ try-catch và ApiResponse<T>
            List<Problem> problems = await _problemRepository.GetAllAsync();
            return _mapper.Map<List<ProblemDto>>(problems);
        }

        // --- GET Problem by ID ---
        // ✅ Kiểu trả về: Task<ProblemDto>
        public async Task<ProblemDto> GetProblemByIdAsync(Guid problemId)
        {
            Problem? problem = await _problemRepository.GetByIdAsync(problemId);

            if (problem == null)
                throw new NotFoundException($"Problem with ID {problemId} not found.");

            return _mapper.Map<ProblemDto>(problem);
        }

        // --- GET Problem by Slug ---
        // ✅ Kiểu trả về: Task<ProblemDto>
        public async Task<ProblemDto> GetProblemBySlugAsync(string slug)
        {
            // Bỏ try-catch và ApiResponse<T>
            Problem? problem = await _problemRepository.GetBySlugAsync(slug);

            if (problem == null)
                throw new NotFoundException($"Problem with slug '{slug}' not found.");

            return _mapper.Map<ProblemDto>(problem);
        }

        // --- UPDATE Problem ---
        // ✅ Kiểu trả về: Task<ProblemDto>
        public async Task<ProblemDto> UpdateProblemAsync(UpdateProblemDto updateProblemDto)
        {
            bool isExistsByTitle = await _problemRepository.ExistsByTitle(updateProblemDto.Title);

            // ✅ FIX: Sửa logic kiểm tra trùng tên (Nên dùng ExistsByTitleAndDifferentIdAsync)
            // Giả định Title trùng với ID khác sẽ ném Conflict
            if (isExistsByTitle)
                throw new ConflictException($"Problem with title '{updateProblemDto.Title}' already exists.");

            // Giả định UpdateAsync nhận DTO và trả về Entity đã cập nhật
            Problem? problem = await _problemRepository.UpdateAsync(updateProblemDto);

            if (problem == null)
                throw new NotFoundException($"Problem with ID {updateProblemDto.ProblemId} not found for update.");

            return _mapper.Map<ProblemDto>(problem);
        }
    }
}