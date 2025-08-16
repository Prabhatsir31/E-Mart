using EMart.DTOs;
using EMart.Models;

namespace EMart.Services
{
    public interface ICartService
    {
        Task<Cart> GetOrCreateActiveCartAsync(long userId);
        Task<Cart> GetCartWithItemsAsync(long userId);
        Task<Cart> AddItemAsync(long userId, AddToCartDto dto);
        Task<Cart> UpdateQuantityAsync(long userId, long cartItemId, int quantity);
        Task<Cart> RemoveItemAsync(long userId, long cartItemId);
        Task ClearAsync(long userId);
    }
}
