using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EMart.Models
{
    public class UserMaster
    {
        [Key]
        public long UserId { get; set; }

        [MaxLength(250)]
        public string? Address { get; set; }

        [Required, MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        public bool IsCardHolder { get; set; }

        [Required, MaxLength(20)]
        public string PhoneNumber { get; set; } = string.Empty;

        public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;

        [Required, MaxLength(100)]
        public string UserName { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        // Navigation
        public LoyaltyCard? LoyaltyCard { get; set; }
        public ICollection<Cart> Carts { get; set; } = new List<Cart>();
        public ICollection<OrderMaster> Orders { get; set; } = new List<OrderMaster>();
    }
}
