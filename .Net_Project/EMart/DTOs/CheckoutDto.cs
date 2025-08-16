// DTOs/CheckoutDto.cs
namespace EMart.DTOs
{
    public class CheckoutDto
    {
        // "courier" or "pickup"
        public string DeliveryOption { get; set; } = "courier";
        public string PaymentMethod { get; set; } = "CARD"; // CARD/UPI/COD etc.
        public int? RedeemPointsRequested { get; set; } = null; // optional order-level redemption
        public long? StoreId { get; set; } = null;             // placeholder if you add stores
    }
}
