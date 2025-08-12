using Hms.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hms.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Doctor,Nurse,Receptionist")] 
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _service;
    public DashboardController(IDashboardService service) { _service = service; }

    [HttpGet("summary")]
    public async Task<ActionResult<object>> Summary() => Ok(await _service.GetSummaryAsync());

    [HttpGet("visits-monthly")]
    public async Task<ActionResult<IEnumerable<object>>> VisitsMonthly([FromQuery] int year) =>
        Ok(await _service.GetMonthlyVisitsAsync(year));
}


