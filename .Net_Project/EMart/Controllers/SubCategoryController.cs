using EMart.Models;
using EMart.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace EMart.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubCategoryController : ControllerBase
    {
        private readonly EMartDbContext _context;

        public SubCategoryController(EMartDbContext context)
        {
            _context = context;
        }

        // GET: api/subcategory
        [HttpGet]
        public async Task<IActionResult> GetAllSubCategories()
        {
            var subCategories = await _context.SubCategories
                .Include(sc => sc.Category)
                .ToListAsync();
            return Ok(subCategories);
        }

        // GET: api/subcategory/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSubCategory(long id)
        {
            var subCategory = await _context.SubCategories
                .Include(sc => sc.Category)
                .FirstOrDefaultAsync(sc => sc.SubCategoryId == id);

            if (subCategory == null)
                return NotFound(new { message = "Subcategory not found" });

            return Ok(subCategory);
        }

        // GET: api/subcategory/category/{categoryId}
        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetSubCategoriesByCategory(long categoryId)
        {
            var subCategories = await _context.SubCategories
                .Where(sc => sc.CategoryId == categoryId)
                .ToListAsync();

            if (!subCategories.Any())
                return NotFound(new { message = "No subcategories found for this category" });

            return Ok(subCategories);
        }
    }
}
