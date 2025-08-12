using Hms.Application.Interfaces;
using Hms.Domain.Entities;
using Hms.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Hms.Infrastructure.Repositories;

public class MedicalRecordRepository : IMedicalRecordRepository
{
    private readonly AppDbContext _db;
    public MedicalRecordRepository(AppDbContext db) { _db = db; }

    public Task<List<MedicalRecord>> GetByPatientAsync(Guid patientId) =>
        _db.MedicalRecords.AsNoTracking().Where(r => r.PatientId == patientId)
            .OrderByDescending(r => r.VisitDate).ToListAsync();

    public async Task<MedicalRecord> AddAsync(MedicalRecord record)
    {
        _db.MedicalRecords.Add(record);
        await _db.SaveChangesAsync();
        return record;
    }
}


