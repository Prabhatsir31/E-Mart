using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EMart.Models
{
    public class LoyaltyCard
    {
        [Key]
        public long LoyaltyCardId { get; set; }

        public DateTime IssueDate { get; set; } = DateTime.UtcNow;

        public int LoyaltyPointBalance { get; set; }

        // Foreign Key
        [ForeignKey(nameof(User))]
        public long UserId { get; set; }
        public UserMaster User { get; set; }
    }
}
