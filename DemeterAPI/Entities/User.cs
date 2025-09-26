using System.ComponentModel.DataAnnotations;
using System.Diagnostics;

namespace JwtAuthTemplateNet8.Entities
{
    public class User
    {
        public Guid UserGuid { get; set; } = Guid.NewGuid();
        [Key]
        public int UserID { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }
    }
}
