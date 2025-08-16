using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EMart.Models
{
    public class CartItem
    {
        [Key]
        public long CartItemId { get; set; }

        public int LoyaltyPointUsed { get; set; }
        public double PriceAddition { get; set; }
        public int Quantity { get; set; }

        // Foreign Keys
        [ForeignKey(nameof(Cart))]
        public long CartId { get; set; }
        public Cart Cart { get; set; }

        [ForeignKey(nameof(Product))]
        public long ProductId { get; set; }
        public Product Product { get; set; }
    }
}
