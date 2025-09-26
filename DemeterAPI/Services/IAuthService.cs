using JwtAuthTemplateNet8.Entities;
using JwtAuthTemplateNet8.Models;

namespace JwtAuthTemplateNet8.Services
{
    public interface IAuthService
    {
        Task<User?> RegisterAsync(UserDto request);
        Task<TokenResponseDto?> LoginAsync(UserDto request, HttpResponse response);
        Task<TokenResponseDto?> RefreshTokenAsync(string refreshToken, HttpResponse response);
        Task<bool> LogoutAsync(Guid userGuid);
    }
}
