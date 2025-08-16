// DTOs/InvoiceResponseDto.cs
using System;
using System.Collections.Generic;

namespace EMart.DTOs
{
    public class InvoiceLineDto
    {
        public long ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public double UnitPriceApplied { get; set; }     // loyal or normal
        public int PointsUsed { get; set; }              // applied for this item
        public double LineSubtotal { get; set; }         // before redemption
        public double LineTotalAfterRedemption { get; set; }
    }

    public class InvoiceResponseDto
    {
        public long OrderId { get; set; }
        public DateTime OrderDate { get; set; }
        public string OrderStatus { get; set; } = "PAID";
        public string PaymentMethod { get; set; } = string.Empty;

        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;

        public List<InvoiceLineDto> Lines { get; set; } = new();
        public double GrossAmount { get; set; }
        public int TotalPointsRedeemed { get; set; }
        public double NetPayable { get; set; }
        public int PointsEarned { get; set; }
        public int NewLoyaltyBalance { get; set; }
        public bool IsCardHolder { get; set; }
        public double TotalSavingForCardHolder { get; set; } // difference vs normal price (nice to show)
    }
}
