using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EMart.Models
{
    public class Cart
    {
        [Key]
        public long CartId { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        // Foreign Key
        [ForeignKey(nameof(User))]
        public long UserId { get; set; }
        public UserMaster User { get; set; }

        // Navigation
        public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    }
}
