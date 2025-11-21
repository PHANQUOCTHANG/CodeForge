

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodeForge.Core.Entities
{
    [Table("TestCases")]
    public class TestCase
    {
        [Key]
        public Guid TestCaseId { get; set; } = Guid.NewGuid();

        [Required]
        public Guid ProblemId { get; set; }

        [ForeignKey(nameof(ProblemId))]
        public Problem? Problem { get; set; }

        /// Dữ liệu đầu vào cho test case (JSON hoặc stdin)
        [Column(TypeName = "NVARCHAR(MAX)")]
        public string? Input { get; set; }

        /// Kết quả mong đợi
        [Column(TypeName = "NVARCHAR(MAX)")]
        public string? ExpectedOutput { get; set; }

        /// Test ẩn (true = ẩn, false = công khai)
        public bool IsHidden { get; set; } = false;

        [Column(TypeName = "NVARCHAR(MAX)")]
        public string Explain { get; set; } = string.Empty;

        // /// Thứ tự sắp xếp test case
        // public int OrderIndex { get; set; } = 0;

        // /// Kiểu input (JSON hoặc STDIN)
        // [MaxLength(20)]
        // public string InputType { get; set; } = "JSON";
        // /// Trọng số test case (nếu cần chấm điểm phần trăm)
        // public float Weight { get; set; } = 1.0f;
        // public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
