// Options/LoyaltyOptions.cs
namespace EMart.Options
{
    public class LoyaltyOptions
    {
        public double EarnRate { get; set; } = 0.10;
        public bool AllowRedemption { get; set; } = true;
    }
}
