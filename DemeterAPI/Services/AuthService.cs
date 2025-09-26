using JwtAuthTemplateNet8.Data;
using JwtAuthTemplateNet8.Entities;
using JwtAuthTemplateNet8.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace JwtAuthTemplateNet8.Services
{
    public class AuthService(UserDbContext context, IConfiguration configuration) : IAuthService
    {
        public async Task<TokenResponseDto?> LoginAsync(UserDto request, HttpResponse response)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
            {
                return null;
            }

            if (BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash) && user.Email == request.Email)
            {
                var accessToken = CreateToken(user);
                var refreshToken = await GenerateAndSaveRefreshTokenAsync(user);

                var cookieOption = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = configuration.GetValue<bool>("AppSettings:isSecureCookie"), //true for prod
                    SameSite = SameSiteMode.Lax, // lax or strict for dev, None for Production
                    Expires = user.RefreshTokenExpiryTime,
                };

                response.Cookies.Append("refreshToken", refreshToken, cookieOption);

                return new TokenResponseDto()
                {
                    AccessToken = accessToken,
                    RefreshToken = string.Empty,
                    ResponseMessage = "Login Successful"
                };
            }

            return null;
        }
        public async Task<bool> LogoutAsync(Guid userGuid)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.UserGuid == userGuid);
            if (user == null)
                return false;

            user.RefreshToken = null;
            user.RefreshTokenExpiryTime = null;
            await context.SaveChangesAsync();
            return true;
        }

        public async Task<User?> RegisterAsync(UserDto request)
        {
            if (await context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return null;
            }

            var user = new User();
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);
            user.Email = request.Email;
            user.Username = request.Username;
            user.PasswordHash = hashedPassword;
            
            context.Users.Add(user);
            await context.SaveChangesAsync();

            return user;    
        }
        private async Task<TokenResponseDto> CreateTokenResponse(User user)
        {
            return new TokenResponseDto
            {
                ResponseMessage = "Login Successful",
                AccessToken = CreateToken(user),
                RefreshToken = await GenerateAndSaveRefreshTokenAsync(user)
            };
        }
        public async Task<TokenResponseDto?> RefreshTokenAsync(string refreshToken, HttpResponse response)
        {

            var user = await ValidateRefreshTokenAsync(refreshToken);
            if (user == null)
            {
                return null;
            }

            var accessToken = CreateToken(user);
            var newRefreshToken = await GenerateAndSaveRefreshTokenAsync(user);

            var cookieOption = new CookieOptions
            {
                HttpOnly = true,
                Secure = configuration.GetValue<bool>("AppSettings:isSecureCookie"), //true for prod
                SameSite = SameSiteMode.Lax, // lax or strict for dev, None for Production
                Expires = user.RefreshTokenExpiryTime,
            };

            response.Cookies.Append("refreshToken", newRefreshToken, cookieOption);

            return new TokenResponseDto()
            {
                AccessToken = accessToken,
                RefreshToken = string.Empty,
                ResponseMessage = "Refresh Successful"
            };

            //return await CreateTokenResponse(user);
            // after creating token, update it on database
        }
        private async Task<User?> ValidateRefreshTokenAsync(string refreshToken)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);
            if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                return null;
            }
            return user;
        }
        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        private async Task<string> GenerateAndSaveRefreshTokenAsync(User user)
        {
            var refreshToken = GenerateRefreshToken();
            int refreshTokenExpiryDays = configuration.GetValue<int>("AppSettings:RefreshTokenExpiryDays");
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(refreshTokenExpiryDays);
            await context.SaveChangesAsync();
            return refreshToken;
        }
        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim> // claim is a piece of information about the user.
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.UserGuid.ToString()),
                new Claim(ClaimTypes.Role, user.Role),
                //add more identity if necessary
            };
            SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration.GetValue<string>("AppSettings:Token")!));

            SigningCredentials creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512); //64 chars token length (token is digitally signed)

            int expiryMinutes = configuration.GetValue<int>("AppSettings:TokenExpiryMinutes");

            JwtSecurityToken tokenDescriptor = new JwtSecurityToken(
                issuer: configuration.GetValue<string>("AppSettings:Issuer"), //Issuer → Who issued the token (your API).
                audience: configuration.GetValue<string>("AppSettings:Audience"), //Audience → Who is allowed to use the token (frontend users).
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        }
    }
}
