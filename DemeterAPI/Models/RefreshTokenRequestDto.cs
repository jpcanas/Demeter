namespace JwtAuthTemplateNet8.Models
{
    public class RefreshTokenRequestDto
    {
        public Guid UserGuid { get; set; }
        public required string RefreshToken { get; set; }
    }
}
