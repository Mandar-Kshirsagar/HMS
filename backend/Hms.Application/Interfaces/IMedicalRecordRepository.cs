using Hms.Domain.Entities;

namespace Hms.Application.Interfaces;

public interface IMedicalRecordRepository
{
    Task<List<MedicalRecord>> GetByPatientAsync(Guid patientId);
    Task<MedicalRecord> AddAsync(MedicalRecord record);
}


