using Hms.Domain.Entities;
using Hms.Infrastructure.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

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
    public ActionResult<IEnumerable<object>> List()
        => Ok(_userManager.Users.Select(u => new { u.Id, u.UserName, u.Email }));
}


