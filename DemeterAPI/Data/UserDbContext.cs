using JwtAuthTemplateNet8.Entities;
using Microsoft.EntityFrameworkCore;

namespace JwtAuthTemplateNet8.Data
{
    public class UserDbContext(DbContextOptions<UserDbContext> options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; }
    }
}
