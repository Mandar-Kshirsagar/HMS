namespace Hms.Application.DTOs;

public record AppointmentDto(int Id, Guid PatientId, string DoctorUserId, DateTime Start, DateTime End, string Status, string? Reason);


