// Services/ICheckoutService.cs
using EMart.DTOs;
using System.Threading.Tasks;

namespace EMart.Services
{
    public interface ICheckoutService
    {
        Task<InvoiceResponseDto> CheckoutAsync(long userId, CheckoutDto dto);
    }
}
