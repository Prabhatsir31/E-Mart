// Controllers/LoyaltyController.cs
using EMart.Helpers;
using EMart.Models;
using EMart.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace EMart.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class LoyaltyController : ControllerBase
    {
        private readonly EMartDbContext _db;
        public LoyaltyController(EMartDbContext db) => _db = db;

        // POST: api/loyalty/upgrade
        [HttpPost("upgrade")]
        public async Task<IActionResult> Upgrade()
        {
            var userId = User.GetUserId();
            if (userId == 0) return Unauthorized();

            var user = await _db.Users
                .Include(u => u.LoyaltyCard)
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null) return NotFound();

            if (user.IsCardHolder) return BadRequest(new { message = "User is already a cardholder." });

            user.IsCardHolder = true;

            if (user.LoyaltyCard == null)
            {
                user.LoyaltyCard = new LoyaltyCard
                {
                    UserId = user.UserId,
                    IssueDate = System.DateTime.UtcNow,
                    LoyaltyPointBalance = 0
                };
                _db.LoyaltyCards.Add(user.LoyaltyCard);
            }

            await _db.SaveChangesAsync();

            return Ok(new
            {
                message = "User upgraded to e-MART cardholder successfully!",
                newLoyaltyBalance = user.LoyaltyCard.LoyaltyPointBalance
            });
        }
    }
}
