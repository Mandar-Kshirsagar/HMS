using Hms.Application.DTOs;
using Hms.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hms.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Doctor,Nurse,Receptionist")] 
public class PatientsController : ControllerBase
{
    private readonly IPatientService _service;
    public PatientsController(IPatientService service) { _service = service; }

    [HttpGet]
    public async Task<ActionResult<List<PatientDto>>> Search([FromQuery] string? q) =>
        Ok(await _service.SearchAsync(q));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<PatientDto>> Get(Guid id)
    {
        var p = await _service.GetAsync(id);
        return p == null ? NotFound() : Ok(p);
    }

    [HttpPost]
    public async Task<ActionResult<PatientDto>> Create([FromBody] CreatePatientDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] CreatePatientDto dto)
    {
        await _service.UpdateAsync(id, dto);
        return NoContent();
    }
}


