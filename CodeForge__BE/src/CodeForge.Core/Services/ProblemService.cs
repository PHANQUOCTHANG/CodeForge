using AutoMapper;
using CodeForge.Api.DTOs;
using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Core.Interfaces.Services;

namespace CodeForge.Core.Service
{
    public class ProblemService : IProblemService
    {

        private readonly IProblemRepository _problemRepository;
        private readonly IMapper _mapper;

        public ProblemService(IProblemRepository problemRepository, IMapper mapper)
        {
            _problemRepository = problemRepository;
            _mapper = mapper;
        }

        public async Task<ApiResponse<ProblemDto>> CreateProblemAsync(CreateProblemDto createProblemDto)
        {
            try
            {
                bool isExistsByTitle = await _problemRepository.ExistsByTitle(createProblemDto.Title);
                if (isExistsByTitle)
                {
                    return new ApiResponse<ProblemDto>(404, "Title is exists");
                }
                Problem problem = await _problemRepository.CreateAsync(createProblemDto);
                ProblemDto problemDto = _mapper.Map<ProblemDto>(problem);

                return new ApiResponse<ProblemDto>(201, "Create problem success", problemDto);
            }
            catch (Exception e)
            {
                return new ApiResponse<ProblemDto>(500, e.Message);
            }
        }

        public async Task<ApiResponse<bool>> DeleteProblemAsync(Guid problemId)
        {
            try
            {
                bool result = await _problemRepository.DeleteAsync(problemId);
                if (!result)
                {
                    return new ApiResponse<bool>(404, "Invalid");
                }
                return new ApiResponse<bool>(200, "Delete problem success");
            }
            catch (Exception e)
            {
                return new ApiResponse<bool>(500, e.Message);
            }
        }

        public async Task<ApiResponse<List<ProblemDto>>> GetAllProblemAsync()
        {
            try
            {
                List<Problem> problems = await _problemRepository.GetAllAsync();
                List<ProblemDto> problemDtos = _mapper.Map<List<ProblemDto>>(problems);

                return new ApiResponse<List<ProblemDto>>(200, "Get all problem success", problemDtos);
            }
            catch (Exception e)
            {
                return new ApiResponse<List<ProblemDto>>(500, e.Message);
            }
        }

        public async Task<ApiResponse<ProblemDto>> GetProblemByIdAsync(Guid problemId)
        {
            try
            {
                Problem? problem = await _problemRepository.GetByIdAsync(problemId);

                if (problem == null)
                {
                    return new ApiResponse<ProblemDto>(404, "Invalid");
                }

                ProblemDto problemDto = _mapper.Map<ProblemDto>(problem);
                return new ApiResponse<ProblemDto>(200, "Get all problem success", problemDto);
            }
            catch (Exception e)
            {
                return new ApiResponse<ProblemDto>(500, e.Message);
            }
        }

        public async Task<ApiResponse<ProblemDto>> UpdateProblemAsync(UpdateProblemDto updateProblemDto)
        {
            try
            {
                bool isExistsByTitle = await _problemRepository.ExistsByTitle(updateProblemDto.Title);
                if (isExistsByTitle) return new ApiResponse<ProblemDto>(404, "Create problem failed");

                Problem? problem = await _problemRepository.UpdateAsync(updateProblemDto);

                if (problem == null)
                {
                    return new ApiResponse<ProblemDto>(404, "Invalid problem need update");
                }

                ProblemDto problemDto = _mapper.Map<ProblemDto>(problem);

                return new ApiResponse<ProblemDto>(201, "Create problem success", problemDto);
            }
            catch (Exception e)
            {
                return new ApiResponse<ProblemDto>(500, e.Message);
            }
        }

        


    }
}