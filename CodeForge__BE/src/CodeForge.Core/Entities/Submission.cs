using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodeForge.Core.Entities
{
    [Table("Submissions")]
    public class Submission
    {
        [Key]
        [Column("SubmissionID")]
        public Guid SubmissionId { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }

        [Required]
        public Guid ProblemId { get; set; }

        [Required]
        public string Code { get; set; } = string.Empty;

        [Required, MaxLength(50)]
        public string Language { get; set; } = string.Empty;

        [Required, MaxLength(30)]
        public string Status { get; set; } = "Accepted"; // Accepted, Wrong Answer, etc.

        [Required]
        public DateTime SubmitTime { get; set; } = DateTime.UtcNow;

        public int? ExecutionTime { get; set; }

        public int? MemoryUsed { get; set; }
        public int? QuantityTestPassed { get; set; }
        public int? QuantityTest { get; set; }

        public Guid? TestCaseIdFail { get; set; }

        // ---------------- 🔗 Navigation Properties ----------------
        [ForeignKey(nameof(UserId))]
        public User? User { get; set; }

        [ForeignKey(nameof(ProblemId))]
        public Problem? Problem { get; set; }

        [ForeignKey(nameof(TestCaseIdFail))]
        public TestCase? TestCase { get; set; }

        [InverseProperty(nameof(SubmissionResult.Submission))]
        public ICollection<SubmissionResult>? SubmissionResults { get; set; }

        public Submission() { }




    }
}
