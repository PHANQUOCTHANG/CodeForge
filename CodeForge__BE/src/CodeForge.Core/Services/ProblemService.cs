using AutoMapper;
using CodeForge.Api.DTOs;
using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Core.Interfaces.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

// ✅ Import Custom Exceptions
using CodeForge.Core.Exceptions;

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
        // ✅ Kiểu trả về mới: Task<ProblemDto>
        public async Task<ProblemDto> CreateProblemAsync(CreateProblemDto createProblemDto)
        {
            // Bỏ khối try-catch
            bool isExistsByTitle = await _problemRepository.ExistsByTitle(createProblemDto.Title);

            // ✅ SỬA: Thay thế return new ApiResponse<ProblemDto>(404, ...) bằng ConflictException (409)
            if (isExistsByTitle)
            {
                throw new ConflictException($"Problem with title '{createProblemDto.Title}' already exists.");
            }

            // Mapping DTO sang Entity và tạo
            Problem problem = await _problemRepository.CreateAsync(createProblemDto);

            return _mapper.Map<ProblemDto>(problem);
        }

        // --- DELETE Problem ---
        // ✅ Kiểu trả về mới: Task<bool>
        public async Task<bool> DeleteProblemAsync(Guid problemId)
        {
            // Bỏ khối try-catch
            bool result = await _problemRepository.DeleteAsync(problemId);

            // ✅ SỬA: Thay thế return new ApiResponse<bool>(404, ...) bằng NotFoundException
            if (!result)
            {
                throw new NotFoundException($"Problem with ID {problemId} not found.");
            }

            return true;
        }

        // --- GET All Problem ---
        // ✅ Kiểu trả về mới: Task<List<ProblemDto>>
        public async Task<List<ProblemDto>> GetAllProblemAsync()
        {
            // Bỏ khối try-catch
            List<Problem> problems = await _problemRepository.GetAllAsync();
            return _mapper.Map<List<ProblemDto>>(problems);
        }

        // --- GET Problem by ID ---
        // ✅ Kiểu trả về mới: Task<ProblemDto>
        public async Task<ProblemDto> GetProblemByIdAsync(Guid problemId)
        {
            // Bỏ khối try-catch
            Problem? problem = await _problemRepository.GetByIdAsync(problemId);

            // ✅ SỬA: Thay thế return new ApiResponse<ProblemDto>(404, ...) bằng NotFoundException
            if (problem == null)
            {
                throw new NotFoundException($"Problem with ID {problemId} not found.");
            }

            return _mapper.Map<ProblemDto>(problem);
        }

        // --- UPDATE Problem ---
        // ✅ Kiểu trả về mới: Task<ProblemDto>
        public async Task<ProblemDto> UpdateProblemAsync(UpdateProblemDto updateProblemDto)
        {
            // Bỏ khối try-catch

            bool isExistsByTitle = await _problemRepository.ExistsByTitle(updateProblemDto.Title);

            // ✅ SỬA: Thay thế return new ApiResponse<ProblemDto>(404, ...) bằng ConflictException (409)
            if (isExistsByTitle)
                throw new ConflictException($"Problem with title '{updateProblemDto.Title}' already exists.");

            Problem? problem = await _problemRepository.UpdateAsync(updateProblemDto);

            // ✅ SỬA: Thay thế return new ApiResponse<ProblemDto>(404, ...) bằng NotFoundException
            if (problem == null)
            {
                throw new NotFoundException($"Problem with ID {updateProblemDto.LessonId} not found for update.");
            }

            return _mapper.Map<ProblemDto>(problem);
        }
    }
}