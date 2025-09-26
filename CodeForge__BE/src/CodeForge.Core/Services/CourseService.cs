using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CodeForge.Core.Entities;
using CodeForge__BE.src.CodeForge.Api.DTOs.Request.Course;
using CodeForge__BE.src.CodeForge.Api.DTOs.Response;
using CodeForge__BE.src.CodeForge.Core.Interfaces.Repositories;
using CodeForge__BE.src.CodeForge.Core.Interfaces.Services;

namespace CodeForge__BE.src.CodeForge.Core.Services
{
    public class CourseService : ICourseService
    {
        private readonly ICourseRepository _repo;
        private readonly IMapper _mapper;
        public CourseService(ICourseRepository _repo, IMapper _mapper)
        {
            this._repo = _repo;
            this._mapper = _mapper;
        }
        public async Task<IEnumerable<CourseDto>> GetAllAsync()
        {
            var courses = await _repo.GetAllAsync();
            return _mapper.Map<IEnumerable<CourseDto>>(courses);
        }

        public async Task<CourseDto?> GetByIdAsync(Guid id)
        {
            var course = await _repo.GetByIdAsync(id);
            return course == null ? null : _mapper.Map<CourseDto>(course);
        }

        public async Task<CourseDto> CreateAsync(createCourseDto _createCourseDto)
        {
            var course = _mapper.Map<Course>(_createCourseDto);
            var createCourse = await _repo.AddAsync(course);
            return _mapper.Map<CourseDto>(createCourse);
        }

        public async Task<CourseDto?> UpdateAsync(Guid id, updateCourseDto _updateCourseDto)
        {
            var course = await _repo.GetByIdAsync(id);
            if (course == null) return null;

            _mapper.Map(_updateCourseDto, course);

            await _repo.UpdateAsync(course);
            return _mapper.Map<CourseDto>(course);


        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var course = await _repo.GetByIdAsync(id);
            if (course == null) return false;

            await _repo.DeleteAsync(course);
            return true;
        }
    }
}