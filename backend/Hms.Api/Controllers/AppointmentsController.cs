using Hms.Application.DTOs;
using Hms.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hms.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Doctor,Nurse,Receptionist")] 
public class AppointmentsController : ControllerBase
{
    private readonly IAppointmentService _service;
    public AppointmentsController(IAppointmentService service) { _service = service; }

    [HttpGet("doctor/{doctorUserId}")]
    public async Task<ActionResult<List<AppointmentDto>>> DoctorSchedule(string doctorUserId, [FromQuery] DateTime? day)
        => Ok(await _service.GetDoctorScheduleAsync(doctorUserId, day));

    [HttpPost]
    public async Task<ActionResult<AppointmentDto>> Book([FromBody] AppointmentDto dto)
        => Ok(await _service.BookAsync(dto));

    [HttpPut("{id:int}/reschedule")]
    public async Task<IActionResult> Reschedule(int id, [FromBody] DateTime newStart)
    { await _service.RescheduleAsync(id, newStart); return NoContent(); }

    [HttpPut("{id:int}/cancel")]
    public async Task<IActionResult> Cancel(int id)
    { await _service.CancelAsync(id); return NoContent(); }
}


