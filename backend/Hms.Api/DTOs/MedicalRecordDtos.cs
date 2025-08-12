namespace Hms.Api.DTOs;

public record MedicalRecordDto(int Id, Guid PatientId, string DoctorUserId, DateTime VisitDate, string Diagnosis, string Prescription, string TreatmentPlan, string? Notes);


