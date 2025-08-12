using Hms.Domain.Entities;
using Hms.Infrastructure.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Hms.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")] 
public class StaffController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    public StaffController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
    { _userManager = userManager; _roleManager = roleManager; }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> List()
    {
        var users = await _userManager.Users.ToListAsync();
        var usersWithRoles = new List<object>();
        
        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            usersWithRoles.Add(new 
            { 
                user.Id, 
                user.UserName, 
                user.Email, 
                user.FullName,
                Roles = roles.ToArray()
            });
        }
        
        return Ok(usersWithRoles);
    }

    [HttpPost]
    public async Task<ActionResult<object>> CreateUser([FromBody] CreateUserDto dto)
    {
        if (await _userManager.FindByNameAsync(dto.Username) != null)
            return BadRequest("Username already exists");

        if (await _userManager.FindByEmailAsync(dto.Email) != null)
            return BadRequest("Email already exists");

        var user = new ApplicationUser
        {
            UserName = dto.Username,
            Email = dto.Email,
            FullName = dto.FullName,
            EmailConfirmed = true
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        if (!string.IsNullOrEmpty(dto.Role))
        {
            if (!await _roleManager.RoleExistsAsync(dto.Role))
                return BadRequest($"Role '{dto.Role}' does not exist");
                
            await _userManager.AddToRoleAsync(user, dto.Role);
        }

        var roles = await _userManager.GetRolesAsync(user);
        return Ok(new 
        { 
            user.Id, 
            user.UserName, 
            user.Email, 
            user.FullName,
            Roles = roles.ToArray(),
            Message = "User created successfully"
        });
    }

    [HttpGet("roles")]
    public async Task<ActionResult<IEnumerable<string>>> GetRoles()
    {
        var roles = await _roleManager.Roles.Select(r => r.Name).ToListAsync();
        return Ok(roles);
    }
}

public record CreateUserDto(string Username, string Email, string FullName, string Password, string Role);


