using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EMart.Models
{
    public class SubCategory
    {
        [Key]
        public long SubCategoryId { get; set; }

        [MaxLength(250)]
        public string? SubCategoryImage { get; set; }

        [Required, MaxLength(100)]
        public string SubCategoryName { get; set; } = string.Empty;

        // Foreign Key
        [ForeignKey(nameof(Category))]
        public long CategoryId { get; set; }

        [JsonIgnore]
        public Category Category { get; set; }

        // Navigation
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
