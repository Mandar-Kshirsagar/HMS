using Hms.Application.DTOs;

namespace Hms.Application.Interfaces;

public interface IMedicalRecordService
{
    Task<List<MedicalRecordDto>> GetByPatientAsync(Guid patientId);
    Task<MedicalRecordDto> AddAsync(MedicalRecordDto dto);
}


