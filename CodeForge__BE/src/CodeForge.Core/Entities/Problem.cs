

namespace CodeForge.Core.Entities
{
    public class Problem
    {
        public Guid ProblemId { get; set; } = Guid.NewGuid();
        public Guid LessonId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Difficulty { get; set; }
        public string Tags { get; set; }
        public int TimeLimit { get; set; }
        public int MemoryLimit { get; set; }
        public bool IsDeleted { get; set; } = false;

        public Problem() { }

        // public Problem(Guid problemId, Guid lessonId, string title, string description, string difficulty, string tags, int timeLimit, int memoryLimit)
        // {
        //     ProblemId = problemId;
        //     LessonId = lessonId;
        //     Title = title;
        //     Description = description;
        //     Difficulty = difficulty;
        //     Tags = tags;
        //     TimeLimit = timeLimit;
        //     MemoryLimit = memoryLimit;
        // }
    }
}