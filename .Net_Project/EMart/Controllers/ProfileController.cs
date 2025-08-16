using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EMart.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // This makes all endpoints require JWT authentication
    public class ProfileController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetProfile()
        {
            // Get user details from JWT token
            var name = User.FindFirst(ClaimTypes.Name)?.Value;
            var email = User.FindFirst(ClaimTypes.Email)?.Value;

            return Ok(new
            {
                Name = name,
                Email = email,
                Message = "Profile fetched successfully"
            });
        }
    }
}
