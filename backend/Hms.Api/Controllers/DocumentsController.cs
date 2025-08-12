using Hms.Application.Interfaces;
using Hms.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hms.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Doctor,Nurse")] 
public class DocumentsController : ControllerBase
{
    private readonly IDocumentRepository _repo;
    private readonly IWebHostEnvironment _env;
    public DocumentsController(IDocumentRepository repo, IWebHostEnvironment env) { _repo = repo; _env = env; }

    [HttpPost("upload/{patientId:guid}")]
    [RequestSizeLimit(25_000_000)]
    public async Task<ActionResult<Document>> Upload(Guid patientId, IFormFile file)
    {
        if (file == null || file.Length == 0) return BadRequest("Empty file");
        var uploadsRoot = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");
        Directory.CreateDirectory(uploadsRoot);
        var safeName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
        var fullPath = Path.Combine(uploadsRoot, safeName);
        using (var stream = System.IO.File.Create(fullPath)) { await file.CopyToAsync(stream); }
        var doc = new Document
        {
            PatientId = patientId,
            FileName = file.FileName,
            FilePath = $"/uploads/{safeName}",
            ContentType = file.ContentType
        };
        await _repo.AddAsync(doc);
        return Ok(doc);
    }

    [HttpGet("patient/{patientId:guid}")]
    public async Task<ActionResult<List<Document>>> Get(Guid patientId) =>
        Ok(await _repo.GetByPatientAsync(patientId));
}


