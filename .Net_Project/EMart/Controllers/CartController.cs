using EMart.DTOs;
using EMart.Helpers;
using EMart.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EMart.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize] // requires JWT
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;
        public CartController(ICartService cartService) => _cartService = cartService;

        // GET: api/cart
        [HttpGet]
        public async Task<IActionResult> GetMyCart()
        {
            var userId = User.GetUserId();
            if (userId == 0) return Unauthorized();

            var cart = await _cartService.GetCartWithItemsAsync(userId);
            //return Ok(cart ?? new { message = "Cart is empty" });
            return cart != null
                    ? Ok(cart)
                    : Ok(new { message = "Cart is empty" });

        }

        // POST: api/cart/add
        [HttpPost("add")]
        public async Task<IActionResult> Add(AddToCartDto dto)
        {
            var userId = User.GetUserId();
            if (userId == 0) return Unauthorized();

            try
            {
                var cart = await _cartService.AddItemAsync(userId, dto);
                return Ok(cart);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // PUT: api/cart/quantity
        [HttpPut("quantity")]
        public async Task<IActionResult> UpdateQuantity(UpdateCartItemDto dto)
        {
            var userId = User.GetUserId();
            if (userId == 0) return Unauthorized();

            try
            {
                var cart = await _cartService.UpdateQuantityAsync(userId, dto.CartItemId, dto.Quantity);
                return Ok(cart);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // DELETE: api/cart/item/{cartItemId}
        [HttpDelete("item/{cartItemId:long}")]
        public async Task<IActionResult> Remove(long cartItemId)
        {
            var userId = User.GetUserId();
            if (userId == 0) return Unauthorized();

            try
            {
                var cart = await _cartService.RemoveItemAsync(userId, cartItemId);
                return Ok(cart);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // DELETE: api/cart/clear
        [HttpDelete("clear")]
        public async Task<IActionResult> Clear()
        {
            var userId = User.GetUserId();
            if (userId == 0) return Unauthorized();

            await _cartService.ClearAsync(userId);
            return Ok(new { message = "Cart cleared" });
        }
    }
}
