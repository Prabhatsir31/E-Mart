using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EMart.Models
{
    public class Category
    {
        [Key]
        public long CategoryId { get; set; }

        [Required, MaxLength(100)]
        public string CategoryName { get; set; } = string.Empty;

        [MaxLength(250)]
        public string? CategoryImage { get; set; }

        // Navigation
        public ICollection<SubCategory> SubCategories { get; set; } = new List<SubCategory>();
    }
}
