using AutoMapper;
using CodeForge.Api.DTOs;
using CodeForge.Core.Entities;
using CodeForge.Core.Interfaces.Repositories;
using CodeForge.Core.Interfaces.Services;

namespace CodeForge.Core.Service
{
    public class LessonService : ILessonService
    {

        private readonly ILessonRepository _lessonRepository;
        private readonly IMapper _mapper;

        public LessonService(ILessonRepository lessonRepository, IMapper mapper)
        {
            _lessonRepository = lessonRepository;
            _mapper = mapper;
        }

        public async Task<ApiResponse<LessonDto>> CreateLessonAsync(CreateLessonDto createLessonDto)
        {
            try
            {
                bool isExistsByTitle = await _lessonRepository.ExistsByTitle(createLessonDto.Title);
                if (isExistsByTitle)
                {
                    return new ApiResponse<LessonDto>(404, "Title is exists");
                }
                Lesson lesson = await _lessonRepository.CreateAsync(createLessonDto);
                LessonDto lessonDto = _mapper.Map<LessonDto>(lesson);

                return new ApiResponse<LessonDto>(201, "Create Lesson success", lessonDto);
            }
            catch (Exception e)
            {
                return new ApiResponse<LessonDto>(500, e.Message);
            }
        }

        public async Task<ApiResponse<bool>> DeleteLessonAsync(Guid lessonId)
        {
            try
            {
                bool result = await _lessonRepository.DeleteAsync(lessonId);
                if (!result)
                {
                    return new ApiResponse<bool>(404, "Invalid");
                }
                return new ApiResponse<bool>(200, "Delete Lesson success");
            }
            catch (Exception e)
            {
                return new ApiResponse<bool>(500, e.Message);
            }
        }

        public async Task<ApiResponse<List<LessonDto>>> GetAllLessonAsync()
        {
            try
            {
                List<Lesson> lessons = await _lessonRepository.GetAllAsync();
                List<LessonDto> lessonDtos = _mapper.Map<List<LessonDto>>(lessons);

                return new ApiResponse<List<LessonDto>>(200, "Get all Lesson success", lessonDtos);
            }
            catch (Exception e)
            {
                return new ApiResponse<List<LessonDto>>(500, e.Message);
            }
        }

        public async Task<ApiResponse<LessonDto>> GetLessonByIdAsync(Guid lessonId)
        {
            try
            {
                Lesson? lesson = await _lessonRepository.GetByIdAsync(lessonId);

                if (lesson == null)
                {
                    return new ApiResponse<LessonDto>(404, "Invalid");
                }

                LessonDto LessonDto = _mapper.Map<LessonDto>(lesson);
                return new ApiResponse<LessonDto>(200, "Get all Lesson success", LessonDto);
            }
            catch (Exception e)
            {
                return new ApiResponse<LessonDto>(500, e.Message);
            }
        }

        public async Task<ApiResponse<LessonDto>> UpdateLessonAsync(UpdateLessonDto updateLessonDto)
        {
            try
            {
                bool isExistsByTitle = await _lessonRepository.ExistsByTitle(updateLessonDto.Title);
                if (isExistsByTitle) return new ApiResponse<LessonDto>(404, "Create Lesson failed");

                Lesson? lesson = await _lessonRepository.UpdateAsync(updateLessonDto);

                if (lesson == null)
                {
                    return new ApiResponse<LessonDto>(404, "Invalid Lesson need update");
                }

                LessonDto lessonDto = _mapper.Map<LessonDto>(lesson);

                return new ApiResponse<LessonDto>(201, "Create Lesson success", lessonDto);
            }
            catch (Exception e)
            {
                return new ApiResponse<LessonDto>(500, e.Message);
            }
        }
    }
}