namespace JwtAuthTemplateNet8.Models
{
    public class TokenResponseDto
    {
        public string? ResponseMessage { get; set; }
        public required string AccessToken { get; set; }
        public required string RefreshToken { get; set; }
    }
}
