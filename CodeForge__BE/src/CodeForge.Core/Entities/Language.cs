using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodeForge.Core.Entities
{
    [Table("Languages")]
    public class LanguageEntity
    {
        [Key]
        public Guid LanguageID { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? Version { get; set; }

        public bool IsDeleted { get; set; } = false;
    }
}