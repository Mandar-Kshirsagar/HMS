using Microsoft.AspNetCore.Identity;

namespace Hms.Infrastructure.Identity;

public class ApplicationUser : IdentityUser
{
    public string FullName { get; set; } = string.Empty;
}


