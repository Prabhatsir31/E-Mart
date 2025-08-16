using System.Security.Claims;

namespace EMart.Helpers
{
    public static class ClaimsExtensions
    {
        public static long GetUserId(this ClaimsPrincipal user)
        {
            var sub = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)
                   ?? user.Claims.FirstOrDefault(c => c.Type == "sub")
                   ?? user.Claims.FirstOrDefault(c => c.Type == "uid");

            return sub != null && long.TryParse(sub.Value, out var id) ? id : 0;
        }
    }
}
