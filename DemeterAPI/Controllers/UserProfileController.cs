using JwtAuthTemplateNet8.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace JwtAuthTemplateNet8.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserProfileController : Controller
    {
        [Authorize]
        [HttpGet("me")]
        public IActionResult GetCurrentUser()
        {
            var username = HttpContext.User.FindFirst(ClaimTypes.Name)?.Value;
            var email = HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;
            var role = HttpContext.User.FindFirst(ClaimTypes.Role)?.Value;
            var identifier = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Ok(new
            {
                Username = username,
                Email = email,
                Role = role,
                Identifier = identifier
            });
        }
    }
}
