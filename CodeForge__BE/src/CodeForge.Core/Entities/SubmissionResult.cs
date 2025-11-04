using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodeForge.Core.Entities
{
    [Table("SubmissionResults")]
    public class SubmissionResult
    {
        [Key]
        [Column("ResultID")]
        public Guid ResultId { get; set; } = Guid.NewGuid();

        [Required]
        public Guid SubmissionId { get; set; }

        [Required]
        public Guid TestCaseId { get; set; }

        [Required, MaxLength(30)]
        public string Status { get; set; } = "Pending"; // Passed, Failed, etc.

        public int? ExecutionTime { get; set; }

        public int? MemoryUsed { get; set; }

        // ---------------- 🔗 Navigation Properties ----------------
        [ForeignKey(nameof(SubmissionId))]  
        [InverseProperty(nameof(Submission.SubmissionResults))]
        public Submission? Submission { get; set; }

        [ForeignKey(nameof(TestCaseId))]
        public TestCase? TestCase { get; set; }

        public SubmissionResult() { }
    }
}
