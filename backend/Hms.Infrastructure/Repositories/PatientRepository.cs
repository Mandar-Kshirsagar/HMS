using Hms.Application.Interfaces;
using Hms.Domain.Entities;
using Hms.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Hms.Infrastructure.Repositories;

public class PatientRepository : IPatientRepository
{
    private readonly AppDbContext _db;
    public PatientRepository(AppDbContext db) { _db = db; }

    public Task<Patient?> GetAsync(Guid id) =>
        _db.Patients.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);

    public Task<List<Patient>> SearchAsync(string? q) =>
        _db.Patients.AsNoTracking()
            .Where(p => string.IsNullOrEmpty(q) || p.FullName.Contains(q))
            .OrderBy(p => p.FullName)
            .ToListAsync();

    public async Task<Patient> AddAsync(Patient patient)
    {
        _db.Patients.Add(patient);
        await _db.SaveChangesAsync();
        return patient;
    }

    public async Task UpdateAsync(Patient patient)
    {
        _db.Patients.Update(patient);
        await _db.SaveChangesAsync();
    }
}


