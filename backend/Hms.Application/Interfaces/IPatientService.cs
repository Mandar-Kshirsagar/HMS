using Hms.Application.DTOs;

namespace Hms.Application.Interfaces;

public interface IPatientService
{
    Task<List<PatientDto>> SearchAsync(string? q);
    Task<PatientDto?> GetAsync(Guid id);
    Task<PatientDto> CreateAsync(CreatePatientDto dto);
    Task UpdateAsync(Guid id, CreatePatientDto dto);
}


