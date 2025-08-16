// Controllers/CheckoutController.cs
using System.Threading.Tasks;
using EMart.DTOs;
using EMart.Helpers;
using EMart.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EMart.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CheckoutController : ControllerBase
    {
        private readonly ICheckoutService _checkoutService;
        public CheckoutController(ICheckoutService checkoutService) => _checkoutService = checkoutService;

        // POST: api/checkout
        [HttpPost]
        public async Task<IActionResult> Checkout(CheckoutDto dto)
        {
            var userId = User.GetUserId();
            if (userId == 0) return Unauthorized();

            try
            {
                var invoice = await _checkoutService.CheckoutAsync(userId, dto);
                return Ok(invoice);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
