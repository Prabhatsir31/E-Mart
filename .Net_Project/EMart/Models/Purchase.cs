using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EMart.Models
{
    public class Purchase
    {
        [Key]
        public long PurchaseId { get; set; }

        public double FinalAmount { get; set; }
        public int LoyaltyPointsEarned { get; set; }

        [Required, MaxLength(50)]
        public string PaymentMethod { get; set; } = string.Empty;

        public DateTime PurchaseDate { get; set; } = DateTime.UtcNow;

        [Required, MaxLength(50)]
        public string PurchaseStatus { get; set; } = string.Empty;

        public int RedeemedPointsUsed { get; set; }

        // Foreign Keys
        [ForeignKey(nameof(Order))]
        public long OrderId { get; set; }
        public OrderMaster Order { get; set; }

        [ForeignKey(nameof(User))]
        public long UserId { get; set; }
        public UserMaster User { get; set; }
    }
}
