using Hms.Application.DTOs;
using Hms.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hms.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Doctor,Nurse")] 
public class RecordsController : ControllerBase
{
    private readonly IMedicalRecordService _service;
    public RecordsController(IMedicalRecordService service) { _service = service; }

    [HttpGet("patient/{patientId:guid}")]
    public async Task<ActionResult<List<MedicalRecordDto>>> GetByPatient(Guid patientId) =>
        Ok(await _service.GetByPatientAsync(patientId));

    [HttpPost]
    public async Task<ActionResult<MedicalRecordDto>> Add([FromBody] MedicalRecordDto dto) =>
        Ok(await _service.AddAsync(dto));
}


