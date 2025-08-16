using Microsoft.EntityFrameworkCore;
using EMart.Models;

namespace EMart.Repository
{
    public class EMartDbContext : DbContext
    {
        public EMartDbContext(DbContextOptions<EMartDbContext> options) : base(options) { }

        public DbSet<UserMaster> Users { get; set; }
        public DbSet<LoyaltyCard> LoyaltyCards { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<SubCategory> SubCategories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<OrderMaster> Orders { get; set; }
        public DbSet<Purchase> Purchases { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // One-to-one between User and LoyaltyCard
            modelBuilder.Entity<UserMaster>()
                .HasOne(u => u.LoyaltyCard)
                .WithOne(l => l.User)
                .HasForeignKey<LoyaltyCard>(l => l.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-many between Category and SubCategory
            modelBuilder.Entity<Category>()
                .HasMany(c => c.SubCategories)
                .WithOne(sc => sc.Category)
                .HasForeignKey(sc => sc.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-many between SubCategory and Product
            modelBuilder.Entity<SubCategory>()
                .HasMany(sc => sc.Products)
                .WithOne(p => p.SubCategory)
                .HasForeignKey(p => p.SubCategoryId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-many between User and Orders
            modelBuilder.Entity<UserMaster>()
                .HasMany(u => u.Orders)
                .WithOne(o => o.User)
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-many between User and Cart
            modelBuilder.Entity<UserMaster>()
                .HasMany(u => u.Carts)
                .WithOne(c => c.User)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-many between User and Purchases (NO CASCADE to avoid multiple paths)
            modelBuilder.Entity<UserMaster>()
                .HasMany<Purchase>()
                .WithOne(p => p.User)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // One-to-many between Orders and Purchases
            modelBuilder.Entity<OrderMaster>()
                .HasMany(o => o.Purchases)
                .WithOne(p => p.Order)
                .HasForeignKey(p => p.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
        }

    }
}
