using Hms.Domain.Entities;

namespace Hms.Application.Interfaces;

public interface IPatientRepository
{
    Task<Patient?> GetAsync(Guid id);
    Task<List<Patient>> SearchAsync(string? q);
    Task<Patient> AddAsync(Patient patient);
    Task UpdateAsync(Patient patient);
}


