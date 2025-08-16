using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EMart.Models
{
    public class OrderMaster
    {
        [Key]
        public long OrderId { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        [Required, MaxLength(50)]
        public string OrderStatus { get; set; } = string.Empty;

        [Required, MaxLength(50)]
        public string PaymentMethod { get; set; } = string.Empty;

        public double TotalAmt { get; set; }
        public int LoyaltyPointEarned { get; set; }
        public int LoyaltyPointRedeemed { get; set; }

        // Foreign Key
        [ForeignKey(nameof(User))]
        public long UserId { get; set; }
        public UserMaster User { get; set; }

        // Navigation
        public ICollection<Purchase> Purchases { get; set; } = new List<Purchase>();
    }
}
