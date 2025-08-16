using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EMart.Models
{
    public class Product
    {
        [Key]
        public long ProductId { get; set; }

        [MaxLength(100)]
        public string? BrandName { get; set; }

        public bool IsSpecialOffer { get; set; }

        [MaxLength(1000)]
        public string? LongDescription { get; set; }

        public double LoyaltyCardHolderPrice { get; set; }

        [MaxLength(250)]
        public string? ProductImage { get; set; }

        [Required, MaxLength(200)]
        public string ProductName { get; set; } = string.Empty;

        public double ProductPrice { get; set; }

        public int ProductStock { get; set; }

        public int RedeemPointRequired { get; set; }

        [MaxLength(500)]
        public string? ShortDescription { get; set; }

        // Foreign Key
        [ForeignKey(nameof(SubCategory))]
        public long SubCategoryId { get; set; }

        [JsonIgnore]
        public SubCategory SubCategory { get; set; }

        // Navigation
        public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    }
}
