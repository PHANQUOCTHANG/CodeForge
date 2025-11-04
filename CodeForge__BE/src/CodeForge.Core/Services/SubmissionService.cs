using AutoMapper;
using CodeForge.Api.DTOs;
using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Core.Interfaces.Services;

using CodeForge.Core.Exceptions;
using CodeForge.Api.DTOs.Request;
using CodeForge.Api.DTOs.Response;


namespace CodeForge.Core.Service
{
    public class SubmissionService : ISubmissionService 
    {
        private readonly ISubmissionRepository _submissionRepository;
        private readonly IMapper _mapper;

        public SubmissionService(ISubmissionRepository submissionRepository, IMapper mapper)
        {
            _submissionRepository = submissionRepository;
            _mapper = mapper;
        }

        // --- CREATE Submission ---
        public async Task<SubmissionDto> CreateSubmissionAsync(CreateSubmissionDto createSubmissionDto)
        {

            Submission submission = await _submissionRepository.CreateAsync(createSubmissionDto);

            return _mapper.Map<SubmissionDto>(submission);
        }

        // --- GET All Submission ---
        public async Task<List<SubmissionDto>> GetAllSubmissionAsync()
        {
            List<Submission> submissions = await _submissionRepository.GetAllAsync();
            return _mapper.Map<List<SubmissionDto>>(submissions);
        }

        // --- GET Submission by ID ---
        public async Task<List<SubmissionDto>> GetSubmissionByIdAsync(Guid problemId , Guid userId)
        {
            List<Submission> submissions = await _submissionRepository.GetByIdAsync(problemId, userId);

            if (submissions == null)
                throw new NotFoundException($"Not found.");

            return _mapper.Map<List<SubmissionDto>>(submissions);
        }
    }
}