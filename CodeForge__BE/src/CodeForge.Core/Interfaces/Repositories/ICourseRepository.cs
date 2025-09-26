using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CodeForge.Core.Entities;

namespace CodeForge__BE.src.CodeForge.Core.Interfaces.Repositories
{
    public interface ICourseRepository
    {
        Task<IEnumerable<Course>> GetAllAsync();
        Task<Course?> GetByIdAsync(Guid id);
        Task<Course> AddAsync(Course course);
        Task UpdateAsync(Course course);
        Task DeleteAsync(Course course);
    }

}