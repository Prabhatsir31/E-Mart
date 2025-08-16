// Services/CheckoutService.cs
using EMart.DTOs;
using EMart.Models;
using EMart.Options;
using EMart.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace EMart.Services
{
    public class CheckoutService : ICheckoutService
    {
        private readonly EMartDbContext _db;
        private readonly LoyaltyOptions _loyalty;

        public CheckoutService(EMartDbContext db, IOptions<LoyaltyOptions> loyalty)
        {
            _db = db;
            _loyalty = loyalty.Value;
        }

        public async Task<InvoiceResponseDto> CheckoutAsync(long userId, CheckoutDto dto)
        {
            // Load user, cart and items
            var user = await _db.Users
                .Include(u => u.LoyaltyCard)
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null) throw new InvalidOperationException("User not found.");

            var cart = await _db.Carts
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null || !cart.CartItems.Any())
                throw new InvalidOperationException("Cart is empty.");

            // Validate stock
            foreach (var ci in cart.CartItems)
            {
                if (ci.Product.ProductStock < ci.Quantity)
                    throw new InvalidOperationException($"Insufficient stock for {ci.Product.ProductName}.");
            }

            // Transaction ensures consistency (stock, orders, loyalty updates)
            using var tx = await _db.Database.BeginTransactionAsync();

            try
            {
                var invoice = new InvoiceResponseDto
                {
                    CustomerName = user.UserName,
                    CustomerEmail = user.Email,
                    PaymentMethod = dto.PaymentMethod,
                    OrderDate = DateTime.UtcNow,
                    IsCardHolder = user.IsCardHolder
                };

                double gross = 0;
                double savingForCardholder = 0;

                // 1) Line pricing and provisional totals
                foreach (var item in cart.CartItems)
                {
                    var p = item.Product;
                    var unitPrice = user.IsCardHolder ? p.LoyaltyCardHolderPrice : p.ProductPrice;

                    // Track cardholder saving (vs normal)
                    if (user.IsCardHolder)
                    {
                        savingForCardholder += Math.Max(0, (p.ProductPrice - unitPrice)) * item.Quantity;
                    }

                    var lineSubTotal = unitPrice * item.Quantity + item.PriceAddition;
                    gross += lineSubTotal;

                    invoice.Lines.Add(new InvoiceLineDto
                    {
                        ProductId = p.ProductId,
                        ProductName = p.ProductName,
                        Quantity = item.Quantity,
                        UnitPriceApplied = unitPrice,
                        PointsUsed = 0, // filled in section 2 if redemption
                        LineSubtotal = lineSubTotal,
                        LineTotalAfterRedemption = lineSubTotal // may change after redemption
                    });
                }

                invoice.GrossAmount = Math.Round(gross, 2);
                invoice.TotalSavingForCardHolder = Math.Round(savingForCardholder, 2);

                // 2) Redemption (order-level simple strategy)
                int available = user.LoyaltyCard?.LoyaltyPointBalance ?? 0;
                int requested = Math.Max(0, dto.RedeemPointsRequested ?? cart.CartItems.Sum(ci => ci.LoyaltyPointUsed));
                int redeemable = _loyalty.AllowRedemption ? Math.Min(available, requested) : 0;

                // Optional cap using per-item RedeemPointRequired
                // We’ll allow up to sum of eligible points across products:
                int maxByProducts = cart.CartItems.Sum(ci => ci.Product.RedeemPointRequired * ci.Quantity);
                redeemable = Math.Min(redeemable, maxByProducts);

                // apply redemption proportionally across lines
                double remainingValue = invoice.Lines.Sum(l => l.LineTotalAfterRedemption);
                int pointsLeft = redeemable;

                foreach (var line in invoice.Lines)
                {
                    if (pointsLeft <= 0 || remainingValue <= 0) break;

                    // allocate points proportional to line value
                    var share = line.LineTotalAfterRedemption / remainingValue;
                    var allocate = (int)Math.Round(pointsLeft * share, MidpointRounding.AwayFromZero);

                    // but don’t exceed line cap from product RedeemPointRequired * qty
                    var productCap = cart.CartItems
                        .Where(ci => ci.ProductId == line.ProductId)
                        .Sum(ci => ci.Product.RedeemPointRequired * ci.Quantity);

                    allocate = Math.Min(allocate, productCap);

                    // Apply allocation
                    line.PointsUsed += allocate;
                    pointsLeft -= allocate;
                    remainingValue -= line.LineTotalAfterRedemption;

                    // Monetary effect of points: 1 point == 1 unit of currency (simple)
                    // If your business uses different conversion, adjust here.
                    line.LineTotalAfterRedemption = Math.Max(0, line.LineTotalAfterRedemption - allocate);
                }

                // If rounding caused a few points leftover, add them to the largest line
                if (pointsLeft > 0 && invoice.Lines.Any())
                {
                    var maxLine = invoice.Lines.OrderByDescending(l => l.LineTotalAfterRedemption).First();
                    var productCap = cart.CartItems
                        .Where(ci => ci.ProductId == maxLine.ProductId)
                        .Sum(ci => ci.Product.RedeemPointRequired * ci.Quantity);

                    var currentUsed = maxLine.PointsUsed;
                    var canAdd = Math.Max(0, productCap - currentUsed);
                    var add = Math.Min(pointsLeft, canAdd);

                    maxLine.PointsUsed += add;
                    maxLine.LineTotalAfterRedemption = Math.Max(0, maxLine.LineTotalAfterRedemption - add);
                    pointsLeft -= add;
                }

                var net = invoice.Lines.Sum(l => l.LineTotalAfterRedemption);
                invoice.TotalPointsRedeemed = invoice.Lines.Sum(l => l.PointsUsed);
                invoice.NetPayable = Math.Round(net, 2);

                // 3) Earn points for cardholders (10% of net payable)
                int earned = user.IsCardHolder ? (int)Math.Floor(invoice.NetPayable * _loyalty.EarnRate) : 0;
                invoice.PointsEarned = earned;

                // 4) Persist: OrderMaster, Purchase, Loyalty balance, Stock
                var order = new OrderMaster
                {
                    OrderDate = DateTime.UtcNow,
                    OrderStatus = "PAID",
                    PaymentMethod = dto.PaymentMethod,
                    TotalAmt = invoice.NetPayable,
                    UserId = user.UserId,
                    LoyaltyPointEarned = earned,
                    LoyaltyPointRedeemed = invoice.TotalPointsRedeemed
                };
                _db.Orders.Add(order);
                await _db.SaveChangesAsync();

                var purchase = new Purchase
                {
                    FinalAmount = invoice.NetPayable,
                    LoyaltyPointsEarned = earned,
                    PaymentMethod = dto.PaymentMethod,
                    PurchaseDate = DateTime.UtcNow,
                    PurchaseStatus = "COMPLETED",
                    RedeemedPointsUsed = invoice.TotalPointsRedeemed,
                    OrderId = order.OrderId,
                    UserId = user.UserId
                };
                _db.Purchases.Add(purchase);

                // Update loyalty balance (if a cardholder or if they apply later, we still maintain the card record)
                if (user.IsCardHolder)
                {
                    if (user.LoyaltyCard == null)
                    {
                        user.LoyaltyCard = new LoyaltyCard
                        {
                            IssueDate = DateTime.UtcNow,
                            LoyaltyPointBalance = 0,
                            UserId = user.UserId
                        };
                        _db.LoyaltyCards.Add(user.LoyaltyCard);
                    }
                    user.LoyaltyCard.LoyaltyPointBalance =
                        Math.Max(0, (user.LoyaltyCard.LoyaltyPointBalance - invoice.TotalPointsRedeemed) + earned);
                }

                // Decrement stock
                foreach (var ci in cart.CartItems)
                {
                    ci.Product.ProductStock -= ci.Quantity;
                }

                // Clear cart
                _db.CartItems.RemoveRange(cart.CartItems);

                await _db.SaveChangesAsync();
                await tx.CommitAsync();

                invoice.OrderId = order.OrderId;
                invoice.NewLoyaltyBalance = user.LoyaltyCard?.LoyaltyPointBalance ?? 0;

                return invoice;
            }
            catch
            {
                await tx.RollbackAsync();
                throw;
            }
        }
    }
}
