namespace EMart.DTOs
{
    public class AddToCartDto
    {
        public long ProductId { get; set; }
        public int Quantity { get; set; } = 1;

        // Optional: if you want to allow using points at item-level (matches your schema)
        public int LoyaltyPointsToUse { get; set; } = 0;

        // Optional: e.g., gift-wrap or add-on warranties
        public double PriceAddition { get; set; } = 0;
    }
}
