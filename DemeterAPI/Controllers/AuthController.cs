using JwtAuthTemplateNet8.Entities;
using JwtAuthTemplateNet8.Models;
using JwtAuthTemplateNet8.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net.NetworkInformation;
using System.Security.Claims;
using System.Text;

namespace JwtAuthTemplateNet8.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(UserDto request)
        {
            var user = await authService.RegisterAsync(request);
            if (user == null)
                return BadRequest("Email already exists");

            return Ok(user);
        }

        [HttpPost("login")]
        public async Task<ActionResult<TokenResponseDto>> Login(UserDto request)
        {
           var response = await authService.LoginAsync(request, Response);
            if (response is null)
            {
                return BadRequest("Invalid email or password");
            }

            return Ok(response);
        }
        [HttpPost("logout")]
        public async Task<ActionResult> Logout([FromBody] LogoutRequestDto request)
        {
            var response = await authService.LogoutAsync(request.UserGuid);
            if (!response)
                return BadRequest("Invalid user");

            return Ok("User logout successfully");
        }

        [HttpPost("refresh-token")]
       // public async Task<ActionResult<TokenResponseDto>> RefreshToken()
        public async Task<IActionResult> RefreshToken()
        {
            var accessToken = Request.Cookies["refreshToken"];
            if(string.IsNullOrEmpty(accessToken))
                return Unauthorized();

            var result = await authService.RefreshTokenAsync(accessToken, Response);
            if (result is null || result.AccessToken is null || result.RefreshToken is null)
                return Unauthorized("Invalid Refresh token");

            return Ok(result);

        }

        [Authorize]
        [HttpGet]
        public IActionResult AuthenticatedOnlyEndpoint()
        {
            return Ok("You are authenticated");

        }

        [Authorize(Roles = "Admin")]
        [HttpGet("admin-only")]
        public IActionResult AdminOnlyEndpoint()
        {
            return Ok("You are admin");

        }


    }
}
