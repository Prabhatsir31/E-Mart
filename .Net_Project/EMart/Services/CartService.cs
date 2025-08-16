using EMart.DTOs;
using EMart.Models;
using EMart.Repository;
using Microsoft.EntityFrameworkCore;

namespace EMart.Services
{
    public class CartService : ICartService
    {
        private readonly EMartDbContext _db;
        public CartService(EMartDbContext db) => _db = db;

        public async Task<Cart> GetOrCreateActiveCartAsync(long userId)
        {
            var cart = await _db.Carts
                .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                cart = new Cart
                {
                    UserId = userId,
                    CreatedDate = DateTime.UtcNow
                };
                _db.Carts.Add(cart);
                await _db.SaveChangesAsync();
            }
            return cart;
        }

        public async Task<Cart> GetCartWithItemsAsync(long userId)
        {
            return await _db.Carts
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                        .ThenInclude(p => p.SubCategory)
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                        .ThenInclude(p => p.SubCategory.Category)
                .FirstOrDefaultAsync(c => c.UserId == userId);
        }

        public async Task<Cart> AddItemAsync(long userId, AddToCartDto dto)
        {
            var cart = await GetOrCreateActiveCartAsync(userId);

            var product = await _db.Products.FirstOrDefaultAsync(p => p.ProductId == dto.ProductId);
            if (product == null)
                throw new ArgumentException("Product not found.");

            if (dto.Quantity <= 0)
                throw new ArgumentException("Quantity must be at least 1.");

            // simple stock check
            if (product.ProductStock < dto.Quantity)
                throw new InvalidOperationException("Insufficient stock.");

            // If the item already exists in cart, just update quantity & points/price addition
            var existing = cart.CartItems.FirstOrDefault(ci => ci.ProductId == dto.ProductId);
            if (existing != null)
            {
                existing.Quantity += dto.Quantity;
                existing.LoyaltyPointUsed += dto.LoyaltyPointsToUse;
                existing.PriceAddition += dto.PriceAddition;
            }
            else
            {
                cart.CartItems.Add(new CartItem
                {
                    ProductId = dto.ProductId,
                    Quantity = dto.Quantity,
                    LoyaltyPointUsed = dto.LoyaltyPointsToUse,
                    PriceAddition = dto.PriceAddition
                });
            }

            await _db.SaveChangesAsync();
            return await GetCartWithItemsAsync(userId);
        }

        public async Task<Cart> UpdateQuantityAsync(long userId, long cartItemId, int quantity)
        {
            if (quantity <= 0) throw new ArgumentException("Quantity must be at least 1.");

            var cart = await GetOrCreateActiveCartAsync(userId);
            var item = await _db.CartItems.Include(ci => ci.Product)
                .FirstOrDefaultAsync(ci => ci.CartItemId == cartItemId && ci.CartId == cart.CartId);

            if (item == null)
                throw new ArgumentException("Cart item not found.");

            if (item.Product.ProductStock < quantity)
                throw new InvalidOperationException("Insufficient stock.");

            item.Quantity = quantity;
            await _db.SaveChangesAsync();
            return await GetCartWithItemsAsync(userId);
        }

        public async Task<Cart> RemoveItemAsync(long userId, long cartItemId)
        {
            var cart = await GetOrCreateActiveCartAsync(userId);
            var item = await _db.CartItems.FirstOrDefaultAsync(ci => ci.CartItemId == cartItemId && ci.CartId == cart.CartId);

            if (item == null)
                throw new ArgumentException("Cart item not found.");

            _db.CartItems.Remove(item);
            await _db.SaveChangesAsync();
            return await GetCartWithItemsAsync(userId);
        }

        public async Task ClearAsync(long userId)
        {
            var cart = await GetOrCreateActiveCartAsync(userId);
            _db.CartItems.RemoveRange(_db.CartItems.Where(ci => ci.CartId == cart.CartId));
            await _db.SaveChangesAsync();
        }
    }
}
