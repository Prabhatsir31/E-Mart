//using EMart.Models;
//using EMart.Repository;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using System.Threading.Tasks;

//namespace EMart.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class ProductController : ControllerBase
//    {
//        private readonly EMartDbContext _context;

//        public ProductController(EMartDbContext context)
//        {
//            _context = context;
//        }

//        // GET: api/product/subcategory/{subCategoryId}
//        [HttpGet("subcategory/{subCategoryId}")]
//        public async Task<IActionResult> GetProductsBySubCategory(long subCategoryId)
//        {
//            var products = await _context.Products
//                .Where(p => p.SubCategoryId == subCategoryId)
//                .ToListAsync();

//            if (!products.Any())
//                return NotFound(new { message = "No products found in this subcategory" });

//            return Ok(products);
//        }

//        // GET: api/product/{id}
//        [HttpGet("{id}")]
//        public async Task<IActionResult> GetProduct(long id)
//        {
//            var product = await _context.Products
//                .Include(p => p.SubCategory)
//                .ThenInclude(sc => sc.Category)
//                .FirstOrDefaultAsync(p => p.ProductId == id);

//            if (product == null)
//                return NotFound(new { message = "Product not found" });

//            return Ok(product);
//        }
//    }
//}


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
    public class ProductController : ControllerBase
    {
        private readonly EMartDbContext _context;

        public ProductController(EMartDbContext context)
        {
            _context = context;
        }

        // ✅ Get products by subcategory
        // GET: api/product/subcategory/{subCategoryId}
        [HttpGet("subcategory/{subCategoryId}")]
        public async Task<IActionResult> GetProductsBySubCategory(long subCategoryId)
        {
            var products = await _context.Products
                .Where(p => p.SubCategoryId == subCategoryId)
                .ToListAsync();

            if (!products.Any())
                return NotFound(new { message = "No products found in this subcategory" });

            return Ok(products);
        }

        // ✅ Get single product by ID (with category/subcategory details)
        // GET: api/product/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduct(long id)
        {
            var product = await _context.Products
                .Include(p => p.SubCategory)
                .ThenInclude(sc => sc.Category)
                .FirstOrDefaultAsync(p => p.ProductId == id);

            if (product == null)
                return NotFound(new { message = "Product not found" });

            return Ok(product);
        }

        // ✅ Get all products (optional - for admin or product listing)
        // GET: api/product
        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            var products = await _context.Products.ToListAsync();
            return Ok(products);
        }
    }
}
