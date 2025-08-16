//// Controllers/OrderController.cs
//using EMart.DTOs;
//using EMart.Helpers;
//using EMart.Models;
//using EMart.Repository;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using System.Linq;
//using System.Threading.Tasks;

//namespace EMart.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    [Authorize]
//    public class OrderController : ControllerBase
//    {
//        private readonly EMartDbContext _db;
//        public OrderController(EMartDbContext db) => _db = db;

//        // GET: api/order/my
//        [HttpGet("my")]
//        public async Task<IActionResult> MyOrders()
//        {
//            var userId = User.GetUserId();
//            if (userId == 0) return Unauthorized();

//            var orders = await _db.Orders
//                .Where(o => o.UserId == userId)
//                .OrderByDescending(o => o.OrderDate)
//                .Select(o => new
//                {
//                    o.OrderId,
//                    o.OrderDate,
//                    o.OrderStatus,
//                    o.TotalAmt,
//                    o.LoyaltyPointEarned,
//                    o.LoyaltyPointRedeemed
//                })
//                .ToListAsync();

//            return Ok(orders);
//        }

//        // GET: api/order/{id} => get invoice details
//        [HttpGet("{id}")]
//        public async Task<IActionResult> GetInvoice(long id)
//        {
//            var userId = User.GetUserId();
//            if (userId == 0) return Unauthorized();

//            var order = await _db.Orders
//                .Include(o => o.CartItems)
//                    .ThenInclude(ci => ci.Product)
//                .FirstOrDefaultAsync(o => o.OrderId == id && o.UserId == userId);

//            if (order == null) return NotFound();

//            var invoice = new InvoiceResponseDto
//            {
//                OrderId = order.OrderId,
//                OrderDate = order.OrderDate,
//                OrderStatus = order.OrderStatus,
//                PaymentMethod = order.PaymentMethod,
//                CustomerName = order.User.UserName,
//                CustomerEmail = order.User.Email,
//                IsCardHolder = order.User.IsCardHolder,
//                PointsEarned = order.LoyaltyPointEarned,
//                TotalPointsRedeemed = order.LoyaltyPointRedeemed,
//                NetPayable = order.TotalAmt,
//                NewLoyaltyBalance = order.User.LoyaltyCard?.LoyaltyPointBalance ?? 0,
//                Lines = order.CartItems.Select(ci => new InvoiceLineDto
//                {
//                    ProductId = ci.ProductId,
//                    ProductName = ci.Product.ProductName,
//                    Quantity = ci.Quantity,
//                    UnitPriceApplied = order.User.IsCardHolder ? ci.Product.LoyaltyCardHolderPrice : ci.Product.ProductPrice,
//                    PointsUsed = ci.LoyalityPointUsed,
//                    LineSubtotal = ci.PriceAddition + (ci.Quantity * (order.User.IsCardHolder ? ci.Product.LoyaltyCardHolderPrice : ci.Product.ProductPrice)),
//                    LineTotalAfterRedemption = (ci.Quantity * (order.User.IsCardHolder ? ci.Product.LoyaltyCardHolderPrice : ci.Product.ProductPrice)) + ci.PriceAddition - ci.LoyalityPointUsed
//                }).ToList()
//            };

//            return Ok(invoice);
//        }
//    }
//}
