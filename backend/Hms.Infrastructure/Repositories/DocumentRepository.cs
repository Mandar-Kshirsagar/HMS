using Hms.Application.Interfaces;
using Hms.Domain.Entities;
using Hms.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Hms.Infrastructure.Repositories;

public class DocumentRepository : IDocumentRepository
{
    private readonly AppDbContext _db;
    public DocumentRepository(AppDbContext db) { _db = db; }

    public async Task<Document> AddAsync(Document document)
    {
        _db.Documents.Add(document);
        await _db.SaveChangesAsync();
        return document;
    }

    public Task<List<Document>> GetByPatientAsync(Guid patientId) =>
        _db.Documents.AsNoTracking().Where(d => d.PatientId == patientId)
            .OrderByDescending(d => d.UploadedAt).ToListAsync();
}


