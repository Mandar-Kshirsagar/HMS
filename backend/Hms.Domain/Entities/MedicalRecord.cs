using System;

namespace Hms.Domain.Entities;

public class MedicalRecord
{
    public int Id { get; set; }
    public Guid PatientId { get; set; }
    public string DoctorUserId { get; set; } = string.Empty;
    public DateTime VisitDate { get; set; } = DateTime.UtcNow;
    public string Diagnosis { get; set; } = string.Empty;
    public string Prescription { get; set; } = string.Empty;
    public string TreatmentPlan { get; set; } = string.Empty;
    public string? Notes { get; set; }
}


